import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
const pdf = require('pdf-parse');

@Injectable()
export class AnalisaVetService {
    constructor(private prisma: PrismaService) { }

    // --- Dynamic Analysis ---

    async analyze(data: { text: string, species?: string }) {
        const species = data.species || 'Cão';

        // 1. Fetch Dynamic References
        const dbReferences = await this.prisma.analisaVetReference.findMany({
            where: { species }
        });

        // Convert to Dictionary for easy lookup
        const refMap: any = {};
        dbReferences.forEach(r => {
            refMap[r.parameter.toLowerCase()] = { min: r.min, max: r.max, unit: r.unit };
        });

        // Fallback to hardcoded if DB is empty (for safety/initial seed)
        if (Object.keys(refMap).length === 0) {
            // ... (Existing Hardcoded Fallback logic could go here, but let's rely on DB for "Training" feature)
        }

        const extractedValues = this.extractValues(data.text);
        const anomalies: any[] = [];
        let summary = `Análise Automática (Espécie: ${species}):\n`;

        // 2. Check Basic Ranges
        for (const [param, value] of Object.entries(extractedValues)) {
            const pKey = param.toLowerCase();
            if (refMap[pKey]) {
                const { min, max } = refMap[pKey];
                if (Number(value) < min) {
                    anomalies.push({ param, value, type: 'LOW' });
                    summary += `- ⚠️ ${param} está BAIXO (${value}).\n`;
                } else if (Number(value) > max) {
                    anomalies.push({ param, value, type: 'HIGH' });
                    summary += `- ⚠️ ${param} está ALTO (${value}).\n`;
                }
            }
        }

        // 3. Check Advanced Rules (Multi-parameter)
        const rules = await this.prisma.analisaVetRule.findMany();
        for (const rule of rules) {
            try {
                const conditions = JSON.parse(rule.conditions); // Array of { param, operator, ref/value }
                let match = true;

                for (const cond of conditions) {
                    const val = extractedValues[cond.param.toLowerCase()];
                    if (val === undefined) { match = false; break; }

                    // Check Condition
                    // Operator: <, >, =, <=, >=
                    // Ref: MIN, MAX (requires refMap lookup)

                    let targetValue = cond.value;
                    if (cond.ref && refMap[cond.param.toLowerCase()]) {
                        if (cond.ref === 'MIN') targetValue = refMap[cond.param.toLowerCase()].min;
                        if (cond.ref === 'MAX') targetValue = refMap[cond.param.toLowerCase()].max;
                    }

                    if (targetValue !== undefined) {
                        if (cond.operator === '>' && !(val > targetValue)) match = false;
                        if (cond.operator === '<' && !(val < targetValue)) match = false;
                        // ... other operators
                    }
                }

                if (match) {
                    summary += `\n💡 **Possível Diagnóstico**: ${rule.name}\n   ${rule.resultText}\n`;
                }
            } catch (e) {
                console.error('Error parsing rule', rule.name, e);
            }
        }

        if (anomalies.length === 0 && !summary.includes('Possível Diagnóstico')) {
            summary += "- ✅ Nenhum parâmetro fora do intervalo de referência detectado.";
        }

        return {
            status: 'COMPLETED',
            analysis: summary,
            extractedValues,
            confidence: 0.95
        };
    }

    // --- CRUD Methods for Training ---

    async getAllReferences() { return this.prisma.analisaVetReference.findMany(); }
    async createReference(data: any) { return this.prisma.analisaVetReference.create({ data }); }
    async updateReference(id: string, data: any) { return this.prisma.analisaVetReference.update({ where: { id }, data }); }
    async deleteReference(id: string) { return this.prisma.analisaVetReference.delete({ where: { id } }); }

    async getAllRules() { return this.prisma.analisaVetRule.findMany(); }
    async createRule(data: any) { return this.prisma.analisaVetRule.create({ data }); }
    async updateRule(id: string, data: any) { return this.prisma.analisaVetRule.update({ where: { id }, data }); }
    async deleteRule(id: string) { return this.prisma.analisaVetRule.delete({ where: { id } }); }


    // Regex Extraction (Ported from Legacy)
    private extractValues(text: string) {
        const values: any = {};

        // Flexible Regex Patterns for PT-BR Lab Results
        // Note: In a real training module, these regexes could also be dynamic!
        const patterns = {
            'eritrocitos': /(?:Hemácias|Eritrócitos|RBC)[\s:.]*([\d,.]+)/i,
            'hemoglobina': /(?:Hemoglobina|Hb|HGB)[\s:.]*([\d,.]+)/i,
            'hematocrito': /(?:Hematócrito|Ht|HCT|VG)[\s:.]*([\d,.]+)/i,
            'leucocitos': /(?:Leucócitos|Leuco|WBC)[\s:.]*([\d,.]+)/i,
            'plaquetas': /(?:Plaquetas|PLT)[\s:.]*([\d,.]+)/i,
            'ureia': /(?:Ureia)[\s:.]*([\d,.]+)/i,
            'creatinina': /(?:Creatinina)[\s:.]*([\d,.]+)/i,
            'alt': /(?:ALT|TGP)[\s:.]*([\d,.]+)/i,
            'fa': /(?:Fosfatase Alcalina|FA)[\s:.]*([\d,.]+)/i
        };

        for (const [key, regex] of Object.entries(patterns)) {
            const match = text.match(regex);
            if (match && match[1]) {
                // Normalize "15.000" -> 15000 and "5,5" -> 5.5
                let valStr = match[1];
                if (valStr.includes('.') && valStr.includes(',')) {
                    // Brazil format 15.000,00 -> remove dot, replace comma
                    valStr = valStr.replace('.', '').replace(',', '.');
                } else if (valStr.includes(',')) {
                    valStr = valStr.replace(',', '.');
                }
                values[key] = parseFloat(valStr);
            }
        }
        return values;
    }

    async analyzeFile(file: Express.Multer.File, medicalRecordId?: string) {
        let extractedText = '';

        if (file.mimetype === 'application/pdf') {
            const buffer = file.buffer;
            const pdfData = await pdf(buffer);
            extractedText = pdfData.text;
        } else {
            // Mock OCR for images for now
            extractedText = `Simulação de OCR para Imagem ${file.originalname}: \n Leucócitos: 25.000 \n Hemoglobina: 10.0`;
        }

        // Try to infer species from text or existing record?
        const species = extractedText.toLowerCase().includes('felino') || extractedText.toLowerCase().includes('gato') ? 'Gato' : 'Cão';

        const analysisResult = await this.analyze({ text: extractedText, species });

        // Save Exam
        if (medicalRecordId) {
            await this.prisma.exam.create({
                data: {
                    name: `Exame (${file.originalname})`,
                    status: 'COMPLETED',
                    resultData: JSON.stringify(analysisResult.extractedValues),
                    analysisSummary: analysisResult.analysis,
                    medicalRecordId: medicalRecordId,
                    fileUrl: 'https://placehold.co/600x400/EEE/31343C?text=PDF+Exam'
                }
            });
        }

        return {
            ...analysisResult,
            extractedText
        };
    }
}
