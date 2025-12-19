import { Module } from '@nestjs/common';
import { GrowthController } from './growth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [GrowthController],
})
export class GrowthModule { }
