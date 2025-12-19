import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && user.passwordHash && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role, clinicId: user.clinicId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                clinicId: user.clinicId
            }
        };
    }

    async registerClinic(data: any) {
        /*
          Data: {
            clinicName: string,
            clinicPhone: string, // WhatsApp
            ownerName: string,
            email: string,
            password: string,
            referralCode?: string // B2B Referral
          }
        */

        // 1. Check if email exists
        const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new UnauthorizedException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        // 2. Transaction: Create Clinic -> Role -> User
        return this.prisma.$transaction(async (tx) => {
            // A. Create Clinic
            const clinic = await tx.clinic.create({
                data: {
                    name: data.clinicName,
                    phone: data.clinicPhone,
                    address: "Endereço não informado",
                    subscriptionStatus: 'TRIAL', // Default to Trial
                    referralCode: `CLINIC-${Math.random().toString(36).substring(7).toUpperCase()}`,
                    // Handle referral logic if code provided
                    ...(data.referralCode ? {
                        referredBy: { connect: { referralCode: data.referralCode } },
                        saasCredits: 1 // 1 Month free for referral
                    } : {})
                }
            });

            // B. Create Admin Role for this Clinic
            const adminRole = await tx.role.create({
                data: {
                    name: 'Administrador',
                    description: 'Acesso total ao sistema',
                    isSystem: true,
                    permissions: JSON.stringify(['*']), // Wildcard for full access
                    clinicId: clinic.id
                }
            });

            // C. Create User linked to Clinic and Role
            const user = await tx.user.create({
                data: {
                    fullName: data.ownerName,
                    email: data.email,
                    passwordHash: hashedPassword,
                    role: 'ADMIN', // Legacy/Fallback
                    roleId: adminRole.id, // New RBAC
                    clinicId: clinic.id,
                    permissions: JSON.stringify(['*'])
                }
            });

            // Login automatically
            return this.login(user);
        });
    }
}
