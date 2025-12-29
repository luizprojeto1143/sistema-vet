import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const AnalisaVet = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Por favor, selecione um arquivo PDF ou CSV.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            // Rota via proxy que bate no Python
            const res = await axios.post('/api/analysis/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(res.data.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Erro ao processar arquivo. Verifique se o serviço Python está rodando.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">AnalisaVet AI 🧬</h2>
                    <p className="text-muted-foreground">Análise inteligente de hemogramas e exames laboratoriais.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Card */}
                <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Upload size={20} /> Upload de Exame
                    </h3>

                    <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                        <input
                            type="file"
                            id="examUpload"
                            className="hidden"
                            accept=".pdf,.csv"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="examUpload" className="cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                                <FileText size={40} className="text-muted-foreground" />
                                <span className="text-sm font-medium">Clique para selecionar PDF ou CSV</span>
                                <span className="text-xs text-muted-foreground">Suporta laudos laboratoriais padrão</span>
                            </div>
                        </label>
                    </div>

                    {file && (
                        <div className="mt-4 p-3 bg-muted rounded-md flex justify-between items-center">
                            <span className="text-sm truncate">{file.name}</span>
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm disabled:opacity-50"
                            >
                                {loading ? 'Analisando...' : 'Processar Agora'}
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Result Card */}
                <div className="bg-card p-6 rounded-lg border border-border shadow-sm flex flex-col">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle size={20} /> Resultado da Análise
                    </h3>

                    <div className="flex-1 bg-muted/20 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[400px]">
                        {result ? (
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                                <span>Aguardando análise...</span>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200 text-center">
                            ⚠️ A IA atua como apoio. A validação final é obrigatória pelo Médico Veterinário.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalisaVet;
