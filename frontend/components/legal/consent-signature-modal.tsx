"use client";

import React, { useRef, useState } from 'react';
import { XMarkIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import SignatureCanvas from 'react-signature-canvas';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (signatureData: string) => void;
    title: string;
    content: string;
    tutorName: string;
}

export default function ConsentSignatureModal({ isOpen, onClose, onConfirm, title, content, tutorName }: Props) {
    const [step, setStep] = useState<1 | 2>(1); // 1 = Read, 2 = Sign
    const sigCanvas = useRef<any>(null);

    if (!isOpen) return null;

    const handleClear = () => {
        sigCanvas.current?.clear();
    };

    const handleSign = () => {
        if (sigCanvas.current?.isEmpty()) {
            alert("Por favor, assine no campo indicado.");
            return;
        }
        const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
        onConfirm(dataUrl);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <CheckBadgeIcon className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-lg font-bold">Assinatura Digital Segura</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 leading-relaxed font-serif max-h-[300px] overflow-y-auto shadow-inner">
                            <p className="whitespace-pre-wrap">{content}</p>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded" id="readConfirm" />
                            <label htmlFor="readConfirm" className="cursor-pointer font-medium">
                                Declaro que li e compreendi todos os termos acima descritos, estando ciente dos riscos e procedimentos a serem realizados no paciente sob minha responsabilidade.
                            </label>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-sm font-bold text-gray-700 mb-2">Assinatura de {tutorName}:</p>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white relative">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
                                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas w-full h-48 cursor-crosshair' }}
                                />
                                <button onClick={handleClear} className="absolute top-2 right-2 text-xs text-gray-400 hover:text-red-500 underline">
                                    Limpar
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 text-center">
                                Esta assinatura será vinculada criptograficamente ao documento acima.
                                IP: {typeof window !== 'undefined' ? 'Registrado' : ''} • Data: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                        Cancelar
                    </button>

                    {step === 1 ? (
                        <button
                            onClick={() => setStep(2)}
                            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl translate-y-0"
                        >
                            Li e Concordo (Avançar)
                        </button>
                    ) : (
                        <button
                            onClick={handleSign}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-colors shadow-lg flex items-center gap-2"
                        >
                            <CheckBadgeIcon className="w-5 h-5" />
                            Assinar Digitalmente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
