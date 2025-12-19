"use client";

import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

interface AddBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    onConfirm: (data: any) => void;
}

export default function AddBatchModal({ isOpen, onClose, product, onConfirm }: AddBatchModalProps) {
    const [batchNumber, setBatchNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [quantity, setQuantity] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            productId: product.id,
            batchNumber,
            expirationDate,
            quantity: Number(quantity)
        });
        onClose();
        // Reset
        setBatchNumber('');
        setExpirationDate('');
        setQuantity(0);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-bold text-slate-800 leading-6">
                                        Adicionar Lote
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 mb-4">
                                        Adicionando lote para: <strong>{product?.name}</strong>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Número do Lote</label>
                                        <div className="relative">
                                            <ArchiveBoxIcon className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                value={batchNumber}
                                                onChange={e => setBatchNumber(e.target.value)}
                                                placeholder="Ex: LOTE-2024-A"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Validade</label>
                                        <div className="relative">
                                            <CalendarIcon className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
                                            <input
                                                type="date"
                                                required
                                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                value={expirationDate}
                                                onChange={e => setExpirationDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            value={quantity}
                                            onChange={e => setQuantity(Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200"
                                        >
                                            Salvar Lote
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
