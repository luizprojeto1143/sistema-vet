import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Suggestion {
    id: string; // Product or Service ID
    name: string;
    type: 'PRODUCT' | 'SERVICE';
    reason: string;
    price: number;
    script?: string;
}

@Injectable()
export class UpsellService {
    constructor(private prisma: PrismaService) { }

    async getSuggestions(data: {
        items: string[];
        species?: string;
        weight?: number;
    }): Promise<Suggestion[]> {
        const suggestions: Suggestion[] = [];
        const { items } = data;

        // Helper to find real product
        const findProduct = async (keyword: string) => {
            return this.prisma.product.findFirst({
                where: {
                    name: { contains: keyword, mode: 'insensitive' },
                    currentStock: { gt: 0 } // Only suggest if in stock
                }
            });
        };

        // 1. Vaccine Logic
        if (items.some(i => i.toLowerCase().includes('vacina') || i.toLowerCase().includes('v8') || i.toLowerCase().includes('v10'))) {

            const vermifugo = await findProduct('Vermífugo');
            if (vermifugo) {
                suggestions.push({
                    id: vermifugo.id,
                    name: vermifugo.name,
                    type: 'PRODUCT',
                    reason: 'Protocolo Vacinal: Requeiro vermifugação.',
                    price: Number(vermifugo.salePrice),
                    script: "Doutor, lembre de mencionar que este vermífugo é de amplo espectro e protege contra o verme do coração."
                });
            }

            const antipulgas = await findProduct('Antipulgas');
            if (antipulgas) {
                suggestions.push({
                    id: antipulgas.id,
                    name: antipulgas.name,
                    type: 'PRODUCT',
                    reason: 'Proteção completa recomendada.',
                    price: Number(antipulgas.salePrice),
                    script: "Sugira o combo trimestral para garantir proteção contínua com desconto."
                });
            }
        }

        // 2. Dermatology Logic
        if (items.some(i => i.toLowerCase().includes('otite') || i.toLowerCase().includes('pele') || i.toLowerCase().includes('coceira'))) {
            // Service suggestion stays mock/hardcoded or fetching from Service table
            const cytologia = await this.prisma.service.findFirst({ where: { name: { contains: 'Citologia', mode: 'insensitive' } } });
            if (cytologia) {
                suggestions.push({
                    id: cytologia.id,
                    name: cytologia.name,
                    type: 'SERVICE',
                    reason: 'Investigação padrão para otite/pele.',
                    price: Number(cytologia.price)
                });
            }

            const shampoo = await findProduct('Shampoo');
            if (shampoo) {
                suggestions.push({
                    id: shampoo.id,
                    name: shampoo.name,
                    type: 'PRODUCT',
                    reason: 'Tratamento de suporte dermatológico.',
                    price: Number(shampoo.salePrice)
                });
            }
        }

        return suggestions;
    }
}
