import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
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

    await prisma.$executeRawUnsafe(`ALTER TABLE "Clinic" ADD COLUMN IF NOT EXISTS "internmentChecklist" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "DailyRecord" ADD COLUMN IF NOT EXISTS "customValues" TEXT;`);
    console.log('EMERGENCY MIGRATION COMPLETE.');
  } catch (err) {
    console.error('Migration failed (ignoring if columns exist):', err);
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
