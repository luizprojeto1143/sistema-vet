import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'master@vetz.com';
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('master123', 10);

        // Create Master User
        // Master user doesn't necessarily need a clinic, but if your system requires it, we can create a "SaaS Clinic"
        // For now, we'll try without clinicId as it is optional in User model
        await prisma.user.create({
            data: {
                email,
                fullName: 'Super Admin VETZ',
                passwordHash: hashedPassword,
                role: 'MASTER',
                permissions: JSON.stringify(['*']), // Full access
                // No clinicId for Master
            },
        });

        console.log('Seed completed: Master user created (master@vetz.com / master123)');
    } else {
        console.log('Master user already exists.');
        // Update password just in case
        const hashedPassword = await bcrypt.hash('master123', 10);
        await prisma.user.update({
            where: { email },
            data: { passwordHash: hashedPassword, role: 'MASTER' }
        });
        console.log('Master user updated.');
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
