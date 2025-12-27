"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (products: any[]) => void;
}

export default function ProductSelectionModal({ isOpen, onClose, onConfirm }: ProductSelectionModalProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (search) {
            setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredProducts(products);
        }
    }, [search, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // MOCK OR REAL ENDPOINT
            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/products`, { headers: { Authorization: `Bearer ${token}` } });
            // For now, mocking since I might not have the full stock endpoint ready or it's complex
            // Simulating a fetch
            setTimeout(() => {
                setProducts([
                    { id: '1', name: 'Vacina V10', price: 85.00, stock: 10 },
                    { id: '2', name: 'Dipirona Injetável', price: 15.00, stock: 50 },
                    { id: '3', name: 'Seringa 3ml', price: 2.50, stock: 100 },
                    { id: '4', name: 'Vermífugo Drontal', price: 45.00, stock: 20 },
                    { id: '5', name: 'Shampoo Dermatológico', price: 60.00, stock: 5 },
                ]);
                setFilteredProducts([
                    { id: '1', name: 'Vacina V10', price: 85.00, stock: 10 },
                    { id: '2', name: 'Dipirona Injetável', price: 15.00, stock: 50 },
                    { id: '3', name: 'Seringa 3ml', price: 2.50, stock: 100 },
                    { id: '4', name: 'Vermífugo Drontal', price: 45.00, stock: 20 },
                    { id: '5', name: 'Shampoo Dermatológico', price: 60.00, stock: 5 },
                ]);
                setLoading(false);
            }, 500);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!selectedProduct) return;
        onConfirm([{
            ...selectedProduct,
            quantity
        }]);
        // Reset
        setSelectedProduct(null);
        setQuantity(1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-green-50">
                    <h3 className="font-bold text-green-900 flex items-center gap-2">
                        <ArchiveBoxIcon className="w-5 h-5" /> Adicionar Produto
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-green-100 rounded-full text-green-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Buscar produto por nome..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Carregando estoque...</div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">Nenhum produto encontrado.</div>
                    ) : (
                        <div className="space-y-1">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`w-full text-left p-3 rounded-lg flex justify-between items-center group transition-colors ${selectedProduct?.id === product.id ? 'bg-green-50 ring-2 ring-green-500' : 'hover:bg-gray-50'}`}
                                >
                                    <div>
                                        <div className="font-bold text-gray-800">{product.name}</div>
                                        <div className="text-xs text-gray-500">Estoque: {product.stock} un</div>
                                    </div>
                                    <div className="font-bold text-green-600">
                                        R$ {Number(product.price).toFixed(2)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-gray-700">{selectedProduct.name}</span>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded bg-white border border-gray-300 hover:bg-gray-50 font-bold">-</button>
                                <span className="w-8 text-center font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded bg-white border border-gray-300 hover:bg-gray-50 font-bold">+</button>
                            </div>
                        </div>
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                        >
                            Confirmar R$ {(selectedProduct.price * quantity).toFixed(2)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
