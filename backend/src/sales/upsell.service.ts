import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface Suggestion {
    id: string; // Product or Service ID
    name: string;
    type: 'PRODUCT' | 'SERVICE';
    reason: string; // "Because you added Vaccine X"
    price: number;
}

@Injectable()
export class UpsellService {
    constructor(private prisma: PrismaService) { }

    async getSuggestions(data: {
        items: string[]; // List of names or IDs of currently added items
        species?: string;
        weight?: number;
    }): Promise<Suggestion[]> {
        const suggestions: Suggestion[] = [];
        const { items, species } = data;

        // --- HARDCODED RULES ENGINE (MVP) ---
        // In the future, this would come from a database table 'SalesRules'

        // 1. Vaccine Logic
        if (items.some(i => i.toLowerCase().includes('vacina') || i.toLowerCase().includes('v8') || i.toLowerCase().includes('v10'))) {
            suggestions.push({
                id: 'mock-vermifugo', // In real app, we'd fetch actual Product ID
                name: 'Vermífugo Plus',
                type: 'PRODUCT',
                reason: 'Protocolo Vacinal: Requeiro vermifugação.',
                price: 45.00
            });
            suggestions.push({
                id: 'mock-antipulgas',
                name: 'Antipulgas Spot-On',
                type: 'PRODUCT',
                reason: 'Proteção completa recomendada.',
                price: 89.90
            });
        }

        // 2. Dermatology Logic
        if (items.some(i => i.toLowerCase().includes('otite') || i.toLowerCase().includes('pele') || i.toLowerCase().includes('coceira'))) {
            suggestions.push({
                id: 'mock-cytology',
                name: 'Citologia de Ouvido',
                type: 'SERVICE',
                reason: 'Investigação padrão para otite/pele.',
                price: 80.00
            });
            suggestions.push({
                id: 'mock-shampoo',
                name: 'Shampoo Hipoalergênico',
                type: 'PRODUCT',
                reason: 'Tratamento de suporte dermatológico.',
                price: 120.00
            });
        }

        // 3. Senior Care
        // If we had age in context... let's assume specific service trigger
        if (items.some(i => i.toLowerCase().includes('geriatria') || i.toLowerCase().includes('renal'))) {
            suggestions.push({
                id: 'mock-renal-food',
                name: 'Ração Renal Care 2kg',
                type: 'PRODUCT',
                reason: 'Suporte nutricional para paciente renal.',
                price: 210.00
            });
        }

        // Fetch real prices/IDs if needed (Mocking for speed)
        // const realProducts = await this.prisma.product.findMany(...)

        return suggestions;
    }
}
