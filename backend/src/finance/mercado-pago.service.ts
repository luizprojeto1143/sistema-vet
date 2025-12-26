import { Injectable } from '@nestjs/common';

@Injectable()
@Injectable()
export class MercadoPagoService {
    private readonly ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

    async createSplitPaymentPreference(clinic: any, transaction: any) {
        // 1. Calculate Platform Fee
        const platformFeePercentage = this.getPlatformFee(clinic);
        // Note: marketplace_fee in MP is the amount the MARKETPLACE (You) keeps.
        // It requires the clinic acts as the seller (using their credentials/access token)
        // OR we use the "aggregator" mode where we are the collector and disburse to them.

        // For this implementation, we assume AGGREGATOR mode:
        // System connects as MAIN collector, and we logically split internal funds.

        const preferencePayload = {
            items: transaction.items.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: Number(item.price)
            })),
            payer: {
                email: transaction.payerEmail,
                first_name: transaction.payerName?.split(' ')[0] || 'Cliente',
                last_name: transaction.payerName?.split(' ').slice(1).join(' ') || ''
            },
            back_urls: {
                success: `https://vetsystem.com/checkout/success`,
                failure: `https://vetsystem.com/checkout/failure`,
                pending: `https://vetsystem.com/checkout/pending`
            },
            auto_return: "approved",
            notification_url: `https://api.vetsystem.com/webhooks/mp?clinicId=${clinic.id}`,
            external_reference: transaction.id,
            statement_descriptor: `VETSYSTEM ${clinic.name.substring(0, 10)}`,
            metadata: {
                clinic_id: clinic.id,
                transaction_id: transaction.id,
                // Critical for Split Logic:
                split_rules: transaction.splitRules // [{ providerId: '123', amount: 50.00, percentage: 10 }]
            }
        };

        // 4. Send to Mercado Pago API
        if (!this.ACCESS_TOKEN) {
            throw new Error("Mercado Pago ACCESS_TOKEN not configured.");
        }

        try {
            const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.ACCESS_TOKEN}`
                },
                body: JSON.stringify(preferencePayload)
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(`Mercado Pago Error: ${err}`);
            }

            const data = await res.json();

            return {
                preferenceId: data.id,
                initPoint: data.init_point, // Real Sandbox/Prod Link
                payload: preferencePayload
            };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to create Payment Preference');
        }
    }

    private getPlatformFee(clinic: any): number {
        if (clinic.acceptedHardwareOffer && clinic.promotionalRateEndsAt) {
            const now = new Date();
            const promoEnd = new Date(clinic.promotionalRateEndsAt);
            if (now <= promoEnd) return 2.5;
        }
        return clinic.platformFeeRate || 5.0;
    }
}
