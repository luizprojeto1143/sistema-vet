
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FiscalService {
    private readonly logger = new Logger(FiscalService.name);

    // Memory Cache for Token (Simple)
    private token: string | null = null;
    private tokenExpiry: number = 0;

    constructor(private prisma: PrismaService) { }

    private async getToken() {
        if (this.token && Date.now() < this.tokenExpiry) return this.token;

        const clientId = process.env.NUVEMFISCAL_CLIENT_ID;
        const clientSecret = process.env.NUVEMFISCAL_CLIENT_SECRET;
        const scope = 'nfse:dps:create nfse:dps:list empresa';

        if (!clientId || !clientSecret) throw new Error('Nuvem Fiscal Credentials Missing');

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('scope', scope);

        const res = await fetch('https://auth.sandbox.nuvemfiscal.com.br/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!res.ok) {
            const err = await res.text();
            this.logger.error(`Auth Failed: ${err}`);
            throw new Error('Failed to authenticate with Nuvem Fiscal');
        }

        const data = await res.json();
        this.token = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Buffer 1 min
        return this.token;
    }

    async emitInvoice(transactionId: string, type: 'NFE' | 'NFSE' = 'NFSE') {
        // 1. Fetch Transaction & Details
        const tx = await this.prisma.financialTransaction.findUnique({
            where: { id: transactionId },
            include: { clinic: true, tutor: true }
        });

        if (!tx || !tx.clinic || !tx.tutor) throw new Error('Invalid Transaction Data for Invoice');

        // 2. Authentication
        const token = await this.getToken();

        // 3. Construct Payload (NFS-e Example)
        // Note: Real payload requires checking Clinic Address & Municipal Service Code.
        // We will assume some defaults for sandbox or use clinic data if available.
        const clinicAddress = JSON.parse((tx.clinic as any).address || '{}');
        const tutorAddress = JSON.parse((tx.tutor as any).address || '{}');

        // Sandbox default for testing usually allows basic data
        const payload = {
            "provedor": {
                "cpf_cnpj": tx.clinic.cnpj || "00000000000191" // Fallback for sandbox
            },
            "tomador": {
                "cpf_cnpj": tx.tutor.cpf || "00000000000",
                "nome": tx.tutor.fullName,
                "email": tx.tutor.email,
                "endereco": {
                    "logradouro": tutorAddress.street || "Rua Teste",
                    "numero": tutorAddress.number || "123",
                    "bairro": tutorAddress.neighborhood || "Centro",
                    "codigo_municipio": "3550308", // SP default for sandbox
                    "uf": "SP",
                    "cep": tutorAddress.zipCode?.replace(/\D/g, '') || "01001000"
                }
            },
            "servicos": [{
                "codigo": "1.09", // Veterinária
                "discriminacao": tx.description,
                "valores": {
                    "servico": Number(tx.amount)
                }
            }],
            "ambiente": "homologacao"
        };

        this.logger.log(`Sending NFS-e to Nuvem Fiscal (Sandbox)... Amount: ${tx.amount}`);

        // 4. Send Request
        const res = await fetch('https://api.sandbox.nuvemfiscal.com.br/nfse/dps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        let invoiceData;
        let status = 'ERROR';
        let reference = '';

        if (res.ok) {
            invoiceData = await res.json();
            status = 'PROCESSING'; // Sandbox is usually async
            reference = invoiceData.id;
            this.logger.log(`NFS-e Sent! Ref: ${reference}`);
        } else {
            const err = await res.text();
            this.logger.error(`NFS-e Failed: ${err}`);
            // Don't throw, save as ERROR record
            status = 'ERROR';
            invoiceData = { error: err };
        }

        // 5. Save Record
        return this.prisma.invoice.create({
            data: {
                financialTransactionId: tx.id,
                clinicId: tx.clinicId,
                tutorId: tx.tutor.id,
                totalAmount: tx.amount,
                type: 'NFSE',
                status: status,
                series: 0,
                number: 0,
                protocol: reference,
                accessKey: null,
                issuedAt: new Date(),
                xmlContent: JSON.stringify(invoiceData), // Storing JSON response for now
                items: {
                    create: [{
                        description: (tx as any).description || 'Serviços Veterinários',
                        quantity: 1,
                        unitPrice: tx.amount,
                        totalPrice: tx.amount,
                        code: '1.09'
                    }]
                }
            }
        });
    }

    async getInvoices(clinicId: string) {
        return this.prisma.invoice.findMany({
            where: { clinicId },
            orderBy: { issuedAt: 'desc' },
            include: { tutor: true }
        });
    }
}
