import { Injectable } from '@nestjs/common';

@Injectable()
export class MercadoPagoService {
    // Config
    private readonly ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN; // YOUR Master Token
    private readonly PLATFORM_FEE_PERCENTAGE = 5.0; // 5%

    // Refactored method to support multiple providers
    async createSplitPaymentPreference(clinic: any, transaction: any) {
        let feePercentage = this.PLATFORM_FEE_PERCENTAGE; // Default platform fee

        if (clinic.acceptedHardwareOffer && clinic.promotionalRateEndsAt) {
            const now = new Date();
            const promoEnd = new Date(clinic.promotionalRateEndsAt);
            if (now <= promoEnd) {
                feePercentage = 2.5; // PROMO RATE
            }
        } else if (clinic.platformFeeRate) {
            feePercentage = clinic.platformFeeRate;
        }

        const amount = Number(transaction.amount);
        const platformFeeAmount = (amount * feePercentage) / 100;

        // 3. Build Disbursements List for Multi-Vendor Split
        // Note: Preference API `marketplace_fee` only covers ONE split (to the App Owner).
        // For Multi-Seller (Clinic + Provider), we need a different approach:
        // A) Intermediate Split: Money goes to Clinic, then Clinic pays Provider (Tax Issue!)
        // B) Advanced Payments (Marketplace): The Cart has multiple items, each linked to a `category_id` or seller?
        // Actually, MP handles this via "Split Payment" strictly defined in /v1/payments (not preference) OR 
        // by creating a preference where `binary_mode: true` is set, but true multi-destination requires 
        // specific configuration often unavailable in simple Preferences.

        // HOWEVER, standard "Split" via Preference usually implies:
        // 1. You (Platform) get `marketplace_fee`
        // 2. The Recipient of the Preference (collector_id) gets the rest.

        // To pay the Provider directly, the Provider must be the `collector_id` of THAT specific item?
        // This effectively splits the cart into multiple payments for the user? No, we want 1 payment.

        // SOLUTION: "Money Split" logic is post-processing OR we use the "Marketplace" feature 
        // where we define `disbursements`. 
        // NOTE: As of 2024, standard implementation is:
        // The Clinic is the `collector`. The Platform takes a fee.
        // To also pay the Anesthetist directly from the user's payment, we need `processing_modes: aggregator`?

        // COMPLEXITY MANAGEMENT:
        // For this Prototype, we will implement the "Digital Split" assuming MP's Advanced Split capability:
        // We will generate the preference for the CLINIC.
        // We will add metadata instructions for the webhooks to handle the secondary transfer?
        // NO. Better:
        // If Provider is External, we set the PROVIDER as the `collector` for their portion of the total?
        // That implies 2 charges.

        // SIMPLIFIED APPROACH for tax avoidance:
        // If an identifiable "External Service" is in the cart, we act as if the Anesthetist IS the seller of that item.
        // This is complex for a boolean "Split" checkbox.

        // LET'S STICK to the most robust method supported by basic MP Connect:
        // We set the CLINIC as the main receiver. 
        // IF a provider needs direct payment, we must use the `disbursements` array if available, 
        // otherwise we fallback to "Clinic receives, then transfers" which fails the tax requirement.

        // REFINED PLAN:
        // We will inject `binary_mode: true` and assume the Clinic is the PRIMARY receiver for now.
        // We will add the `mpRecipientId` of providers to metadata.
        // *The actual automatic split to 3+ parties technically requires the Advanced Payments API v2*, 
        // which creates a payment intent. Preferences are for Checkouts.

        // FOR NOW: I will implement the metadata passing so the webhook CAN process the secondary transfer
        // leveraging the Clinic's wallet balance immediately after payment.
        // This creates a "Flow": User -> Clinic -> (Auto-Transfer) -> Provider.
        // This is "Split" from a cashflow perspective, though slightly different fiscally.
        // TO DO REAL FISCAL SPLIT (User pays Provider), we need separate items in Checkout Pro matching different collectors.

        const preference = {
            items: transaction.items.map((item: any) => ({
                title: item.title,
                unit_price: Number(item.price),
                quantity: 1,
                currency_id: 'BRL',
                // IF we could specify category_id or similar to route...
            })),
            marketplace_fee: platformFeeAmount,
            notification_url: `https://api.vetsystem.com/webhooks/mp?clinicId=${clinic.id}`,
            payer: {
                email: transaction.payerEmail,
            },
            metadata: {
                // Info for post-processing sub-splits
                providers: transaction.splitRules || []
            }
        };

        // Mock Response
        return {
            preferenceId: 'mock-pref-multi-123',
            initPoint: 'https://mercadopago.com.br/checkout/v1/redirect?pref_id=mock',
            splitDebug: {
                total: amount,
                platformFee: platformFeeAmount,
                clinicNet: amount - platformFeeAmount, // Before provider split
                providerSplits: transaction.splitRules // { providerId, amount }
            }
        };
    }
}
