import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../common/notification.service';

@Injectable()
export class StockService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) { }

    // 1. Process Inbound (Manual Entry or XML)
    async processInbound(data: { clinicId: string; productId: string; quantity: number; costPrice: number; expirationDate: string; batchNumber: string; provider?: string; invoiceNumber?: string; userId: string }) {
        return this.prisma.$transaction(async (tx) => {
            // A. Create Batch
            const batch = await tx.productBatch.create({
                data: {
                    productId: data.productId,
                    quantity: data.quantity,
                    expirationDate: new Date(data.expirationDate),
                    batchNumber: data.batchNumber
                }
            });

            // B. Log Movement (IN_PURCHASE)
            const move = await tx.stockMovement.create({
                data: {
                    clinicId: data.clinicId,
                    productId: data.productId,
                    type: 'IN_PURCHASE', // Entrada por Compra
                    quantity: data.quantity,
                    reason: `NF ${data.invoiceNumber || 'S/N'} - ${data.provider || 'Fornecedor avulso'}`,
                    // createdBy: data.userId, // REMOVED: Not in schema
                    batchId: batch.id
                }
            });

            // C. Update Product Stock & Cost
            await tx.product.update({
                where: { id: data.productId },
                data: {
                    currentStock: { increment: data.quantity },
                    costPrice: data.costPrice
                }
            });

            return batch;
        });
    }

    // 2. Consume Kit with FIFO Logic
    async consumeKit(data: { clinicId: string; kitId: string; quantity: number; userId: string; medicalRecordId?: string }) {
        const kit = await this.prisma.productKit.findUnique({
            where: { id: data.kitId },
            include: { items: { include: { product: true } } }
        });

        if (!kit) throw new Error('Kit not found');

        return this.prisma.$transaction(async (tx) => {
            const results = [];

            for (const item of kit.items) {
                let qtyToDeduct = Number(item.quantity) * data.quantity;
                const productId = item.productId;

                // FIFO Logic
                const batches = await tx.productBatch.findMany({
                    where: { productId, quantity: { gt: 0 } },
                    orderBy: { expirationDate: 'asc' }
                });

                for (const batch of batches) {
                    if (qtyToDeduct <= 0) break;

                    const available = Number(batch.quantity);
                    const take = Math.min(available, qtyToDeduct);

                    // Deduct from batch
                    await tx.productBatch.update({
                        where: { id: batch.id },
                        data: { quantity: { decrement: take } }
                    });

                    // Log Movement
                    const move = await tx.stockMovement.create({
                        data: {
                            clinicId: data.clinicId,
                            productId: productId,
                            type: 'OUT_CONSUME',
                            quantity: take,
                            reason: `Kit: ${kit.name} (Batch ${batch.batchNumber})`,
                            // createdBy: data.userId, // REMOVED
                            batchId: batch.id
                        }
                    });
                    results.push(move);

                    qtyToDeduct -= take;
                }

                if (qtyToDeduct > 0) {
                    await tx.stockMovement.create({
                        data: {
                            clinicId: data.clinicId,
                            productId: productId,
                            type: 'OUT_CONSUME',
                            quantity: qtyToDeduct,
                            reason: `Kit: ${kit.name} (No Batch)`,
                            // createdBy: data.userId, // REMOVED
                        }
                    });
                }

                // Sync Total Product Stock
                const totalDeduct = Number(item.quantity) * data.quantity;
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        currentStock: { decrement: totalDeduct }
                    }
                });
            }
            return results;
        });
    }

    // 3. Manual / Ad-hoc Consumption
    async manualConsume(data: { clinicId: string; productId: string; quantity: number; reason: string; userId: string }) {
        return this.prisma.$transaction(async (tx) => {
            let qtyToDeduct = data.quantity;

            const batches = await tx.productBatch.findMany({
                where: { productId: data.productId, quantity: { gt: 0 } },
                orderBy: { expirationDate: 'asc' }
            });

            const movements = [];

            for (const batch of batches) {
                if (qtyToDeduct <= 0) break;
                const available = Number(batch.quantity);
                const take = Math.min(available, qtyToDeduct);

                await tx.productBatch.update({
                    where: { id: batch.id },
                    data: { quantity: { decrement: take } }
                });

                movements.push(await tx.stockMovement.create({
                    data: {
                        clinicId: data.clinicId,
                        productId: data.productId,
                        type: 'OUT_CONSUME',
                        quantity: take,
                        reason: `${data.reason} (Batch ${batch.batchNumber})`,
                        // createdBy: data.userId, // REMOVED
                        batchId: batch.id
                    }
                }));

                qtyToDeduct -= take;
            }

            if (qtyToDeduct > 0) {
                movements.push(await tx.stockMovement.create({
                    data: {
                        clinicId: data.clinicId,
                        productId: data.productId,
                        type: 'OUT_CONSUME',
                        quantity: qtyToDeduct,
                        reason: `${data.reason} (No Batch)`,
                        // createdBy: data.userId, // REMOVED
                    }
                }));
            }

            await tx.product.update({
                where: { id: data.productId },
                data: { currentStock: { decrement: data.quantity } }
            });

            return movements;
        });
    }

    async getProductMovements(productId: string) {
        return this.prisma.stockMovement.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            // include: { batch: true } // REMOVED: Relation not defined in schema
        });
    }

    // 4. Low Stock Alert Job
    @Cron(CronExpression.EVERY_HOUR)
    async checkLowStock() {
        const products = await this.prisma.product.findMany({
            where: {
                currentStock: { lte: this.prisma.product.fields.minStock }
            },
            include: { clinic: true }
        });

        for (const product of products) {
            await this.notificationService.create({
                clinicId: product.clinicId,
                type: 'ALERT',
                title: 'Estoque Baixo',
                message: `O produto ${product.name} atingiu o nível crítico (${product.currentStock} un).`
            });
        }
    }
}
