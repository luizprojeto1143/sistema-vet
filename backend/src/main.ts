import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // EMERGENCY DB FIX: Manually add missing columns if they don't exist
  // Using direct PrismaClient to avoid Dependency Injection issues
  const prisma = new PrismaClient();
  try {
    console.log('RUNNING EMERGENCY MIGRATION (Direct Client)...');
    await prisma.$connect();
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "fullName" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cpf" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "photoUrl" TEXT;`);

    // Round 3: Role and Professional Details
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "roleId" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "crmv" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pixKeyType" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pixKey" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "commissionRate" DOUBLE PRECISION;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mpRecipientId" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "permissions" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "clinicId" TEXT;`);

    await prisma.$executeRawUnsafe(`ALTER TABLE "Clinic" ADD COLUMN IF NOT EXISTS "internmentChecklist" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "DailyRecord" ADD COLUMN IF NOT EXISTS "customValues" TEXT;`);
    console.log('EMERGENCY MIGRATION COMPLETE.');

    // EMERGENCY SEED: Ensure Admin User Exists
    const adminEmail = 'admin@vet.com';
    const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!adminExists) {
      console.log('CREATING DEFAULT ADMIN USER...');
      // Create Clinic first
      const clinic = await prisma.clinic.create({
        data: {
          name: 'Clínica Veterinária Modelo',
          cnpj: '00.000.000/0001-00',
          planStatus: 'ACTIVE'
        }
      });

      // Hash password "123456"
      const hashedPassword = await bcrypt.hash('123456', 10);

      await prisma.user.create({
        data: {
          email: adminEmail,
          fullName: 'Administrador Principal',
          passwordHash: hashedPassword,
          role: 'ADMIN',
          clinicId: clinic.id,
          permissions: JSON.stringify({ all: true })
        }
      });
      console.log('DEFAULT ADMIN CREATED: admin@vet.com / 123456');
    } else {
      console.log('ADMIN USER ALREADY EXISTS.');
    }

  } catch (err) {
    console.error('Migration/Seed failed:', err);
  } finally {
    await prisma.$disconnect();
  }

  // Enable CORS for frontend
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter()); // Will create this next
  await app.listen(process.env.PORT || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
