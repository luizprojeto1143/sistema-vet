import React, { useState } from 'react';
import { PaperClipIcon, ArrowUpTrayIcon, DocumentIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

interface FilesTabProps {
    petId: string;
}

export default function FilesTab({ petId }: FilesTabProps) {
    // Mock files for now as we don't have a backend Table for "Attachments" yet
    const [files, setFiles] = useState<any[]>([
        { id: 1, name: 'Exame_De_Sangue_2024.pdf', size: '2.4 MB', type: 'PDF', date: '2024-05-15' },
        { id: 2, name: 'Raio_X_Torax.jpg', size: '5.1 MB', type: 'IMG', date: '2024-02-10' },
    ]);

    const handleUpload = () => {
        // Implement upload logic
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                setFiles([...files, {
                    id: Date.now(),
                    name: file.name,
                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                    date: new Date().toISOString().split('T')[0]
                }]);
            }
        };
        input.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div>
                    <h3 className="text-indigo-800 font-bold flex items-center gap-2">
                        <PaperClipIcon className="w-5 h-5" /> Arquivos & Anexos
                    </h3>
                    <p className="text-xs text-indigo-600 mt-1">Exames, laudos e imagens.</p>
                </div>
                <button
                    onClick={handleUpload}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-sm"
                >
                    <ArrowUpTrayIcon className="w-4 h-4" /> Upload
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map(file => (
                    <div key={file.id} className="group relative p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    <DocumentIcon className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-800 text-sm truncate max-w-[150px]">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {file.type}
                            </span>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                            <button className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-md">
                                <EyeIcon className="w-5 h-5" />
                            </button>
                            <button className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 backdrop-blur-md">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
