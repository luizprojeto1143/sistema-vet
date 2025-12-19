"use client";
import { useState } from 'react';

export default function AnalisaVetPage() {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [examText, setExamText] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:4000/analisavet/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: examText })
            });
            if (res.ok) {
                setAnalysis(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                AnalisaVet AI 🤖
            </h1>
            <p className="text-gray-500 mb-8">Inteligência Artificial para auxílio diagnóstico.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 flex flex-col gap-4">

                        {/* File Upload Option */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        setLoading(true);
                                        const formData = new FormData();
                                        formData.append('file', e.target.files[0]);

                                        try {
                                            const token = localStorage.getItem('token');
                                            const res = await fetch('http://localhost:4000/analisavet/upload', {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${token}` }, // Content-Type is auto-set with FormData
                                                body: formData
                                            });
                                            if (res.ok) setAnalysis(await res.json());
                                        } catch (err) {
                                            console.error(err);
                                            alert('Erro ao enviar arquivo.');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                            />
                            <div className="text-purple-600 text-4xl mb-2">📄</div>
                            <p className="font-bold text-gray-700">Clique para enviar PDF ou Imagem</p>
                            <p className="text-xs text-gray-400">Suporta laudos digitalizados ou fotos.</p>
                        </div>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OU digite manualmente</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <textarea
                            className="w-full border p-4 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 transition-all"
                            placeholder="Cole o texto do exame aqui..."
                            value={examText}
                            onChange={(e) => setExamText(e.target.value)}
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !examText}
                            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {loading ? 'Analisando...' : '🔍 Analisar Agora'}
                        </button>
                    </div>
                </div>

                <div>
                    {analysis ? (
                        <div className="bg-green-50 p-6 rounded-xl border border-green-200 animate-fade-in">
                            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                                <span>✅ Resultado da Análise</span>
                                <span className="text-xs bg-green-200 px-2 py-1 rounded text-green-800">Confiança: {(analysis.confidence * 100).toFixed(0)}%</span>
                            </h3>
                            <div className="prose text-gray-700 whitespace-pre-line">
                                {analysis.analysis}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 text-gray-400 text-center">
                            <p>Os resultados da análise aparecerão aqui.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
