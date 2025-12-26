
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    async sendWhatsApp(to: string, message: string) {
        const url = process.env.WHATSAPP_API_URL; // e.g., http://localhost:8000/api/send
        const session = process.env.WHATSAPP_SESSION;
        const key = process.env.WHATSAPP_KEY;

        if (!url || !session) {
            this.logger.warn(`[WhatsApp] Missing Configuration. Message to ${to} NOT sent.`);
            return { success: false, error: 'Configuration Missing' };
        }

        try {
            const body = {
                phone: to.replace(/\D/g, ''), // Clean numbers
                message: message,
                session: session
            };

            // Example Integration (WPPConnect/Evolution style)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': key || ''
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error(`Provider returned ${res.status}`);

            const data = await res.json();
            this.logger.log(`[WhatsApp] Sent to ${to}: ${JSON.stringify(data)}`);
            return { success: true, provider: 'WPPConnect', data };
        } catch (error) {
            this.logger.error(`[WhatsApp] Failed to send to ${to}`, error);
            return { success: false, error: 'Provider Error' };
        }
    }

    async sendEmail(to: string, subject: string, body: string) {
        // Integration Point: SendGrid / AWS SES
        this.logger.log(`[Email] Sending to ${to} | Subject: ${subject}`);
        return { success: true, provider: 'mock' };
    }

    async sendAppointmentConfirmation(appointment: any) {
        const tutorPhone = appointment.pet?.tutor?.phone;
        const petName = appointment.pet?.name;
        const date = new Date(appointment.date).toLocaleString('pt-BR');

        if (tutorPhone) {
            const msg = `Olá! O agendamento de ${petName} está confirmado para ${date}. Veterinário: ${appointment.vet?.fullName || 'Clínica'}.`;
            await this.sendWhatsApp(tutorPhone, msg);
        }
    }
}
