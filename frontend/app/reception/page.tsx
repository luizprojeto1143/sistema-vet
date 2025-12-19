"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplitPaymentModal from '@/components/finance/split-modal';

export default function ReceptionDashboard() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cashier, setCashier] = useState<any>({ status: 'LOADING' });

    // Modals
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

    // POS Product Search
    const [products, setProducts] = useState<any[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [foundProducts, setFoundProducts] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        // 1. Appointments
        const resAppt = await fetch('http://localhost:4000/appointments', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resAppt.ok) {
            const data = await resAppt.json();
            const today = new Date().toISOString().split('T')[0];
            const todayAppts = data.filter((a: any) => a.date.startsWith(today) || new Date(a.date).toLocaleDateString() === new Date().toLocaleDateString());
            setAppointments(todayAppts);
        }

        // 2. Cashier
        const resCash = await fetch('http://localhost:4000/finance/cashier/status', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resCash.ok) setCashier(await resCash.json());

        // 3. Products (Pre-fetch for speed, or could do search API)
        const resProd = await fetch('http://localhost:4000/products', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resProd.ok) {
            const allProducts = await resProd.json();
            // Filter "SALE" or "BOTH"
            setProducts(allProducts.filter((p: any) => p.usageType !== 'INTERNAL'));
        }

        setLoading(false);
    };

    const handleProductSearch = (term: string) => {
        setProductSearch(term);
        if (term.length > 2) {
            setFoundProducts(products.filter(p => p.name.toLowerCase().includes(term.toLowerCase())));
        } else {
            setFoundProducts([]);
        }
    };

    const addProductToCart = (product: any) => {
        setCheckoutItems([...checkoutItems, {
            productId: product.id,
            description: product.name,
            amount: Number(product.salePrice),
            quantity: 1,
            type: 'PRODUCT'
        }]);
        setProductSearch('');
        setFoundProducts([]);

        // Update Total
        if (selectedTransaction) {
            setSelectedTransaction({
                ...selectedTransaction,
                amount: selectedTransaction.amount + Number(product.salePrice)
            })
        }
    };

    const removeProductFromCart = (index: number) => {
        const item = checkoutItems[index];
        const newItems = checkoutItems.filter((_, i) => i !== index);
        setCheckoutItems(newItems);
        if (selectedTransaction) {
            setSelectedTransaction({
                ...selectedTransaction,
                amount: selectedTransaction.amount - Number(item.amount)
            })
        }
    };

    const handleCheckIn = async (id: string, name: string) => {
        if (!confirm(`Confirmar chegada de ${name}?`)) return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4000/appointments/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: 'WAITING' })
        });
        loadData();
        alert('Check-in realizado! Veterinário notificado.');
    };

    const handleCheckout = (apt: any) => {
        // Calculate Total
        const servicePrice = Number(apt.service?.salePrice || apt.service?.price || 0);
        const consumedTotal = apt.medicalRecord?.consumedItems ? JSON.parse(JSON.stringify(apt.medicalRecord.consumedItems)).reduce((acc: number, item: any) => acc + Number(item.price || 0), 0) : 0;

        const total = servicePrice + consumedTotal;

        // Propagate metadata for Payment
        setSelectedTransaction({
            id: apt.id, // Appointment ID, logic might need Transaction ID later
            tutor: apt.pet?.tutor?.fullName,
            description: `Atendimento ${apt.pet?.name} (${apt.service?.name})`,
            amount: total > 0 ? total : 150.00, // Fallback if 0
            originalAmount: total, // Keep tracking of base amount
            items: apt.medicalRecord?.consumedItems || []
        });

        setCheckoutItems([
            { description: `Serviço: ${apt.service?.name || 'Consulta'}`, amount: servicePrice, type: 'SERVICE' },
            ...(apt.medicalRecord?.consumedItems ? apt.medicalRecord.consumedItems : [])
        ]);

        setShowPaymentModal(true);
    };

    const processPayment = async (method: string, splitRules?: any) => {
        if (!selectedTransaction) return;

        const token = localStorage.getItem('token');

        // Extract Products for Stock Deduction
        const productItems = checkoutItems
            .filter(i => i.type === 'PRODUCT')
            .map(i => ({ productId: i.productId, quantity: i.quantity }));

        const payload = {
            type: 'INCOME',
            amount: selectedTransaction.amount,
            description: selectedTransaction.description,
            status: 'PAID',
            paymentMethod: method === 'SPLIT' ? 'SPLIT_QR' : method,
            category: 'Medical Services',
            clinicId: 'clinic-1', // Should come from Token/Context
            splitRules: splitRules, // Only for Split
            items: productItems // Send stock deduction request
        };

        const res = await fetch('http://localhost:4000/finance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            // Also update Appointment to COMPLETED_PAID
            await fetch(`http://localhost:4000/appointments/${selectedTransaction.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'COMPLETED_PAID' })
            });

            alert('Pagamento Confirmado! Estoque Atualizado. 💰');
            setShowPaymentModal(false);
            setShowSplitModal(false);
            loadData();
        } else {
            alert('Erro ao processar pagamento.');
        }
    };

    // Cashier Actions
    const handleCashierAction = async (action: 'open' | 'close') => {
        const amount = prompt(action === 'open' ? "Valor inicial:" : "Valor conferido:", "0.00");
        if (!amount) return;

        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4000/finance/cashier/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ amount })
        });
        loadData();
    };

    if (loading) return <div className="p-10 flex justify-center text-gray-500">Carregando recepção...</div>;

    const stats = {
        total: appointments.length,
        waiting: appointments.filter(a => a.status === 'WAITING').length,
        inService: appointments.filter(a => a.status === 'IN_PROGRESS').length,
        completed: appointments.filter(a => a.status === 'COMPLETED').length
    };

    return (
        <div className="p-8 max-w-7xl mx-auto relative bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Recepção - Agenda do Dia</h1>

                {/* Cashier Widget */}
                <div className={`flex items-center gap-4 px-6 py-3 rounded-xl shadow-lg border ${cashier.status === 'OPEN' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                    }`}>
                    <div className="text-right">
                        <p className={`text-xs font-bold uppercase ${cashier.status === 'OPEN' ? 'text-green-700' : 'text-red-700'}`}>
                            {cashier.status === 'OPEN' ? 'Caixa Aberto' : 'Caixa Fechado'}
                        </p>
                        {cashier.status === 'OPEN' && (
                            <p className="font-mono font-bold text-xl text-green-900">R$ {cashier.summary?.current?.toFixed(2) || '0.00'}</p>
                        )}
                    </div>
                    <button
                        onClick={() => handleCashierAction(cashier.status === 'OPEN' ? 'close' : 'open')}
                        className={`px-4 py-2 rounded font-bold text-white text-sm ${cashier.status === 'OPEN' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {cashier.status === 'OPEN' ? 'Fechar' : 'Abrir'}
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm text-center">
                    <span className="block text-4xl font-bold text-blue-700">{stats.total}</span>
                    <span className="text-sm text-blue-600 font-bold uppercase">Agendamentos</span>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm text-center">
                    <span className="block text-4xl font-bold text-orange-700">{stats.waiting}</span>
                    <span className="text-sm text-orange-600 font-bold uppercase">Aguardando</span>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm text-center">
                    <span className="block text-4xl font-bold text-green-700">{stats.inService}</span>
                    <span className="text-sm text-green-600 font-bold uppercase">Em Atendimento</span>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm text-center">
                    <span className="block text-4xl font-bold text-purple-700">{stats.completed}</span>
                    <span className="text-sm text-purple-600 font-bold uppercase">Checkout Pendente</span>
                </div>
            </div>

            {/* Agenda List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-700">Fluxo de Pacientes</h2>
                    <button onClick={() => router.push('/vet/appointments')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 text-sm">
                        + Novo (Agenda)
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {appointments.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">Nenhum agendamento hoje.</div>
                    ) : (
                        appointments.map((apt: any) => (
                            <div key={apt.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <div className="text-center w-16">
                                        <p className="font-bold text-gray-800 text-lg">{new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-xs text-gray-400">Horário</p>
                                    </div>
                                    <div className={`w-2 h-12 rounded-full ${apt.status === 'WAITING' ? 'bg-orange-500' :
                                        apt.status === 'IN_PROGRESS' ? 'bg-green-500' :
                                            apt.status === 'COMPLETED' ? 'bg-purple-500' :
                                                apt.status === 'COMPLETED_PAID' ? 'bg-gray-400' : 'bg-blue-500'
                                        }`}></div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{apt.pet?.name} <span className="text-sm font-normal text-gray-500">({apt.pet?.species})</span></h3>
                                        <p className="text-sm text-gray-600">{apt.tutor?.fullName || apt.pet?.tutor?.fullName} • {apt.type}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {(apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED') && (
                                        <button
                                            onClick={() => handleCheckIn(apt.id, apt.pet?.name)}
                                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700"
                                        >
                                            📍 Check-in
                                        </button>
                                    )}
                                    {apt.status === 'WAITING' && (
                                        <span className="px-4 py-2 bg-orange-100 text-orange-800 font-bold rounded-lg animate-pulse border border-orange-200">
                                            ⏳ Aguardando
                                        </span>
                                    )}
                                    {apt.status === 'IN_PROGRESS' && (
                                        <span className="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg border border-green-200">
                                            🩺 Em Atendimento
                                        </span>
                                    )}
                                    {apt.status === 'COMPLETED' && (
                                        <button
                                            onClick={() => handleCheckout(apt)}
                                            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow hover:bg-purple-700 flex items-center gap-2"
                                        >
                                            💲 Receber (Checkout)
                                        </button>
                                    )}
                                    {apt.status === 'COMPLETED_PAID' && (
                                        <span className="px-4 py-2 bg-gray-100 text-gray-800 font-bold rounded-lg border border-gray-200">
                                            ✅ Finalizado
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* PAYMENT MODAL (Simplified Overlay) */}
            {showPaymentModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden p-6 animate-fade-in relative">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h2>
                        <p className="text-gray-500 mb-6">{selectedTransaction.description}</p>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-60 overflow-y-auto">
                            {/* Product Search */}
                            <div className="mb-4 relative">
                                <input
                                    className="w-full text-sm p-2 border rounded"
                                    placeholder="🔍 Adicionar produto (ex: Ração, Shampoo)..."
                                    value={productSearch}
                                    onChange={e => handleProductSearch(e.target.value)}
                                />
                                {foundProducts.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white border shadow-xl z-20 max-h-40 overflow-y-auto">
                                        {foundProducts.map(p => (
                                            <div
                                                key={p.id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                                                onClick={() => addProductToCart(p)}
                                            >
                                                <span>{p.name} - {p.usageType === 'BOTH' ? '(Híbrido)' : ''}</span>
                                                <span className="font-bold">R$ {Number(p.salePrice).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {checkoutItems.map((item: any, i) => (
                                <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0 items-center group">
                                    <div className="flex gap-2 items-center">
                                        {item.type === 'PRODUCT' && <button onClick={() => removeProductFromCart(i)} className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100">x</button>}
                                        <span>{item.description || item.name}</span>
                                    </div>
                                    <span className="font-mono">R$ {Number(item.amount || item.price || 0).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
                                <span>Total</span>
                                <span>R$ {selectedTransaction.amount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button onClick={() => processPayment('CREDIT_CARD')} className="p-3 border rounded-lg hover:bg-gray-50 font-bold">💳 Crédito</button>
                            <button onClick={() => processPayment('DEBIT_CARD')} className="p-3 border rounded-lg hover:bg-gray-50 font-bold">💳 Débito</button>
                            <button onClick={() => processPayment('PIX')} className="p-3 border rounded-lg hover:bg-gray-50 font-bold">💠 Pix</button>
                            <button onClick={() => processPayment('CASH')} className="p-3 border rounded-lg hover:bg-gray-50 font-bold">💵 Dinheiro</button>
                        </div>

                        <button
                            onClick={() => { setShowPaymentModal(false); setShowSplitModal(true); }}
                            className="w-full bg-indigo-100 text-indigo-700 py-3 rounded-lg font-bold hover:bg-indigo-200 mb-4"
                        >
                            ⚡ Dividir Pagamento (Comissões)
                        </button>

                        <button onClick={() => setShowPaymentModal(false)} className="w-full text-gray-400 hover:text-red-500 text-sm">Cancelar</button>
                    </div>
                </div>
            )}

            {showSplitModal && selectedTransaction && (
                <SplitPaymentModal
                    total={selectedTransaction.amount}
                    items={selectedTransaction.items} // Pass items for calculation
                    onClose={() => setShowSplitModal(false)}
                    onConfirm={(splits: any) => processPayment('SPLIT', splits)}
                />
            )}
        </div>
    );
}
