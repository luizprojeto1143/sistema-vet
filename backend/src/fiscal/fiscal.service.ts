
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FiscalService {
    private readonly logger = new Logger(FiscalService.name);

    constructor(private prisma: PrismaService) { }

    async emitInvoice(transactionId: string, type: 'NFE' | 'NFSE' = 'NFSE') {
        // 1. Fetch Transaction & Details
        const tx = await this.prisma.financialTransaction.findUnique({
            where: { id: transactionId },
            include: { clinic: true, tutor: true }
        });

        if (!tx) throw new Error('Transaction not found');
        if (!tx.tutor) throw new Error('Transaction missing Tutor (CPF/CNPJ required)');
        if (!tx.clinic) throw new Error('Transaction missing Clinic data');

        // 2. Mock Emission Process (Integration with e-notas or similar would be here)
        this.logger.log(`Emitting Invoice for Tx ${tx.id} - Type: ${type}`);

        // Simulate waiting for API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Create Invoice Record
        const invoice = await this.prisma.invoice.create({
            data: {
                financialTransactionId: tx.id,
                clinicId: tx.clinicId,
                tutorId: tx.tutor.id,
                totalAmount: tx.amount,
                type,
                status: 'AUTHORIZED', // Mock Success
                series: 1,
                number: Math.floor(Math.random() * 100000), // Mock Number
                protocol: `PROT-${Date.now()}`,
                accessKey: `35${Date.now()}0001${Math.floor(Math.random() * 10000)}`, // Pseudo Key
                issuedAt: new Date(),
                xmlContent: '<xml>Mock XML Content</xml>', // TODO: Generate Real XML
                items: {
                    create: [{
                        description: (tx as any).description || 'Serviços Veterinários',
                        quantity: 1,
                        unitPrice: tx.amount,
                        totalPrice: tx.amount,
                        code: '1.09' // Vet Service Code
                    }]
                }
            }
        });

        return invoice;
    }

    async getInvoices(clinicId: string) {
        return this.prisma.invoice.findMany({
            where: { clinicId },
            orderBy: { issuedAt: 'desc' },
            include: { tutor: true }
        });
    }
}
