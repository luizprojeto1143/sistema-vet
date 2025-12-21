import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@vet.com';
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Create Clinic
        const clinic = await prisma.clinic.create({
            data: {
                name: 'Clínica Veterinária Modelo',
                cnpj: '00.000.000/0001-00',
                planStatus: 'ACTIVE'
            }
        });

        // Create Admin User
        await prisma.user.create({
            data: {
                email,
                fullName: 'Administrador Principal',
                passwordHash: hashedPassword,
                role: 'ADMIN',
                clinicId: clinic.id,
                permissions: JSON.stringify({ all: true })
            },
        });

        console.log('Seed completed: Admin user created (admin@vet.com / 123456)');
    } else {
        console.log('Admin user already exists.');
    }

    // --- Create Master User ---
    const masterEmail = 'master@vetz.com';
    const existingMaster = await prisma.user.findUnique({ where: { email: masterEmail } });

    if (!existingMaster) {
        const masterPassword = await bcrypt.hash('master123', 10);
        await prisma.user.create({
            data: {
                email: masterEmail,
                fullName: 'Super Admin VETZ',
                passwordHash: masterPassword,
                role: 'MASTER',
                permissions: JSON.stringify(['*']),
            },
        });
        console.log('Seed completed: Master user created (master@vetz.com / master123)');
    } else {
        console.log('Master user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
