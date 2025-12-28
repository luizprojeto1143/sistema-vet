import React from 'react';
import {
    CheckCircleIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
    user?: {
        name: string;
        email: string;
    }
}

interface Props {
    logs: AuditLog[];
}

export default function AuditTimeline({ logs }: Props) {
    const getIcon = (action: string) => {
        switch (action) {
            case 'CREATE': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'UPDATE': return <PencilSquareIcon className="w-5 h-5 text-blue-500" />;
            case 'DELETE': return <TrashIcon className="w-5 h-5 text-red-500" />;
            default: return <EyeIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const formatJSON = (jsonString: string | null) => {
        if (!jsonString) return null;
        try {
            const obj = JSON.parse(jsonString);
            return (
                <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto max-w-full">
                    {JSON.stringify(obj, null, 2)}
                </pre>
            );
        } catch {
            return <span className="text-xs text-gray-400">{jsonString}</span>;
        }
    };

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {logs.map((log, logIdx) => (
                    <li key={log.id}>
                        <div className="relative pb-8">
                            {logIdx !== logs.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center ring-8 ring-white">
                                        {getIcon(log.action)}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm text-gray-500">
                                                <span className="font-bold text-gray-900">{log.user?.name || 'Sistema'}</span>{' '}
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ml-2 ${log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {log.action}
                                                </span>{' '}
                                                <span className="text-gray-600">em {log.entity}</span>
                                            </p>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                <time dateTime={log.timestamp}>{format(new Date(log.timestamp), "dd 'de' MMM, HH:mm", { locale: ptBR })}</time>
                                            </div>
                                        </div>

                                        {/* Diff View */}
                                        {(log.oldValue || log.newValue) && (
                                            <div className="mt-2 bg-white rounded-lg border border-gray-200 p-3 grid grid-cols-2 gap-4">
                                                {log.oldValue && (
                                                    <div>
                                                        <span className="text-xs font-bold text-red-500 uppercase">Antes</span>
                                                        {formatJSON(log.oldValue)}
                                                    </div>
                                                )}
                                                {log.newValue && (
                                                    <div>
                                                        <span className="text-xs font-bold text-green-500 uppercase">Depois</span>
                                                        {formatJSON(log.newValue)}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <p className="mt-1 text-xs text-gray-400 font-mono">ID: {log.entityId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
