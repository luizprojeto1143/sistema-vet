import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        if (!process.env.JWT_SECRET) {
          if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET is not defined in production environment!');
          } else {
            console.warn('WARNING: JWT_SECRET is missing. Using unsafe dev secret.');
          }
        }
        return {
          secret: process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod',
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
