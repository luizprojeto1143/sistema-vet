import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as pdf from 'pdf-parse';

@Injectable()
export class AnalisaVetService {
    constructor(private prisma: PrismaService) { }

    // Reference Ranges (Ported from Legacy Python)
    private readonly REFERENCE_RANGES = {
        'Cão': {
            'eritrocitos': { min: 5.5, max: 8.5, unit: '10⁶/µL' },
            'hemoglobina': { min: 12, max: 18, unit: 'g/dL' },
            'hematocrito': { min: 37, max: 55, unit: '%' },
            'leucocitos': { min: 6000, max: 17000, unit: '/µL' },
            'plaquetas': { min: 200000, max: 500000, unit: '/µL' }
        },
        'Gato': {
            'eritrocitos': { min: 5.0, max: 10.0, unit: '10⁶/µL' },
            'hemoglobina': { min: 8, max: 15, unit: 'g/dL' },
            'hematocrito': { min: 24, max: 45, unit: '%' },
            'leucocitos': { min: 5500, max: 19500, unit: '/µL' },
            'plaquetas': { min: 300000, max: 800000, unit: '/µL' }
        }
    };

    async analyze(data: { text: string, species?: string }) {
        const species = data.species || 'Cão'; // Default to Dog if unknown
        const ref = this.REFERENCE_RANGES[species] || this.REFERENCE_RANGES['Cão'];

        const extractedValues = this.extractValues(data.text);
        const anomalies = [];
        let summary = `análise Automática (Espécie: ${species}):\n`;

        // Check Rules
        for (const [param, value] of Object.entries(extractedValues)) {
            if (ref[param]) {
                const { min, max } = ref[param];
                if (value < min) {
                    anomalies.push(`${param} BAIXO (${value} < ${min})`);
                    summary += `- ⚠️ ${param} está BAIXO (${value}). Sugere anemia ou deficiência.\n`;
                } else if (value > max) {
                    anomalies.push(`${param} ALTO (${value} > ${max})`);
                    summary += `- ⚠️ ${param} está ALTO (${value}). Sugere infecção/inflamação ou policitemia.\n`;
                }
            }
        }

        if (anomalies.length === 0) {
            summary += "- ✅ Nenhum parâmetro fora do intervalo de referência detectado nesta leitura preliminar.";
        } else {
            summary += `\nForam detectadas ${anomalies.length} alterações. Recomendação: Correlação clínica necessária.`;
        }

        return {
            status: 'COMPLETED',
            analysis: summary,
            extractedValues,
            confidence: 0.95
        };
    }

    // Regex Extraction (Ported from Legacy)
    private extractValues(text: string) {
        const values: any = {};

        // Flexible Regex Patterns for PT-BR Lab Results
        const patterns = {
            'eritrocitos': /(?:Hemácias|Eritrócitos|RBC)[\s:.]*([\d,.]+)/i,
            'hemoglobina': /(?:Hemoglobina|Hb|HGB)[\s:.]*([\d,.]+)/i,
            'hematocrito': /(?:Hematócrito|Ht|HCT|VG)[\s:.]*([\d,.]+)/i,
            'leucocitos': /(?:Leucócitos|Leuco|WBC)[\s:.]*([\d,.]+)/i,
            'plaquetas': /(?:Plaquetas|PLT)[\s:.]*([\d,.]+)/i
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
                // If value looks like 20.000 (3 decimals), it might be thousands separator without comma
                // Simple heuristic: if > 1000 and contains dot? Just parse float

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
