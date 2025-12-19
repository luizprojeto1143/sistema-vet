import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationService } from './notification.service';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule { }
