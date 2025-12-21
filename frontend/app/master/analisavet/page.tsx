"use client";
import { useState, useEffect } from 'react';

export default function AnalisaVetTrainingPage() {
    const [activeTab, setActiveTab] = useState<'REFERENCES' | 'RULES'>('REFERENCES');
    const [references, setReferences] = useState<any[]>([]);
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newRef, setNewRef] = useState({ parameter: '', species: 'Cão', min: 0, max: 0, unit: '' });
    const [newRule, setNewRule] = useState({ name: '', resultText: '', conditions: [] as any[] });
    const [conditionDraft, setConditionDraft] = useState({ param: '', operator: '>', ref: 'MAX', value: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        try {
            const [refRes, ruleRes] = await Promise.all([
                fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/analisavet/training/references', { headers }),
                fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/analisavet/training/rules', { headers })
            ]);

            if (refRes.ok) setReferences(await refRes.json());
            if (ruleRes.ok) setRules(await ruleRes.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const saveReference = async () => {
        const token = localStorage.getItem('token');
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/analisavet/training/references', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newRef)
        });
        setNewRef({ parameter: '', species: 'Cão', min: 0, max: 0, unit: '' });
        fetchData();
    };

    const addCondition = () => {
        setNewRule(prev => ({ ...prev, conditions: [...prev.conditions, conditionDraft] }));
    };

    const saveRule = async () => {
        const token = localStorage.getItem('token');
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/analisavet/training/rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...newRule, conditions: JSON.stringify(newRule.conditions) })
        });
        setNewRule({ name: '', resultText: '', conditions: [] });
        fetchData();
    };

    const deleteItem = async (type: 'references' | 'rules', id: string) => {
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/analisavet/training/${type}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
    };

    if (loading) return <div className="p-10">Carregando Treinamento IA...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-purple-900">🧠 Treinamento AnalisaVet</h1>
            <p className="text-gray-500 mb-8">Ensine a IA novos exames, valores de referência e regras de diagnóstico.</p>

            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setActiveTab('REFERENCES')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'REFERENCES' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    📊 Valores de Referência
                </button>
                <button 
                    onClick={() => setActiveTab('RULES')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'RULES' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    ⚖️ Regras de Diagnóstico
                </button>
            </div>

            {activeTab === 'REFERENCES' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                        <h2 className="font-bold text-lg mb-4">Parâmetros Cadastrados</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-gray-500 text-sm">
                                    <th className="pb-2">Parâmetro</th>
                                    <th className="pb-2">Espécie</th>
                                    <th className="pb-2">Mínimo</th>
                                    <th className="pb-2">Máximo</th>
                                    <th className="pb-2">Unidade</th>
                                    <th className="pb-2">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {references.map(ref => (
                                    <tr key={ref.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="py-3 font-medium">{ref.parameter}</td>
                                        <td className="py-3">{ref.species}</td>
                                        <td className="py-3 text-blue-600">{ref.min}</td>
                                        <td className="py-3 text-red-600">{ref.max}</td>
                                        <td className="py-3 text-gray-500">{ref.unit}</td>
                                        <td className="py-3">
                                            <button onClick={() => deleteItem('references', ref.id)} className="text-red-500 hover:text-red-700">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-fit">
                        <h2 className="font-bold text-lg mb-4 text-purple-800">Novo Parâmetro</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Nome do Parâmetro (ex: Ureia)</label>
                                <input 
                                    className="w-full border p-2 rounded" 
                                    value={newRef.parameter} 
                                    onChange={e => setNewRef({...newRef, parameter: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Espécie</label>
                                <select 
                                    className="w-full border p-2 rounded"
                                    value={newRef.species}
                                    onChange={e => setNewRef({...newRef, species: e.target.value})}
                                >
                                    <option>Cão</option>
                                    <option>Gato</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500">Mínimo</label>
                                    <input 
                                        type="number" 
                                        className="w-full border p-2 rounded" 
                                        value={newRef.min} 
                                        onChange={e => setNewRef({...newRef, min: parseFloat(e.target.value)})} 
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500">Máximo</label>
                                    <input 
                                        type="number" 
                                        className="w-full border p-2 rounded" 
                                        value={newRef.max} 
                                        onChange={e => setNewRef({...newRef, max: parseFloat(e.target.value)})} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Unidade (ex: mg/dL)</label>
                                <input 
                                    className="w-full border p-2 rounded" 
                                    value={newRef.unit} 
                                    onChange={e => setNewRef({...newRef, unit: e.target.value})} 
                                />
                            </div>
                            <button 
                                onClick={saveReference}
                                className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700 mt-2"
                            >
                                Salvar Referência
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Rules List */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                        <h2 className="font-bold text-lg mb-4">Regras de Diagnóstico Ativas</h2>
                        <div className="space-y-4">
                            {rules.map(rule => (
                                <div key={rule.id} className="border p-4 rounded-lg hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-purple-800">{rule.name}</h3>
                                        <button onClick={() => deleteItem('rules', rule.id)} className="text-red-500 text-sm">🗑️ Remover</button>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded text-sm font-mono text-gray-600 mb-2">
                                        {JSON.parse(rule.conditions).map((c: any, i: number) => (
                                            <span key={i} className="block">
                                                {i > 0 && <span className="text-purple-500 font-bold"> E </span>}
                                                SE {c.param} {c.operator} {c.ref === 'MIN' ? 'MÍNIMO' : c.ref === 'MAX' ? 'MÁXIMO' : c.value}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700 italic">" {rule.resultText} "</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rule Builder */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-fit">
                        <h2 className="font-bold text-lg mb-4 text-purple-800">Criar Nova Regra</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Nome do Diagnóstico</label>
                                <input 
                                    className="w-full border p-2 rounded" 
                                    placeholder="Ex: Insuficiência Renal"
                                    value={newRule.name}
                                    onChange={e => setNewRule({...newRule, name: e.target.value})}
                                />
                            </div>

                            <div className="bg-white p-3 rounded border">
                                <h4 className="text-xs font-bold text-gray-500 mb-2">Adicionar Condição</h4>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input 
                                        className="border p-1 rounded text-sm" 
                                        placeholder="Parâmetro (ex: Ureia)"
                                        value={conditionDraft.param}
                                        onChange={e => setConditionDraft({...conditionDraft, param: e.target.value})}
                                    />
                                    <select 
                                        className="border p-1 rounded text-sm"
                                        value={conditionDraft.operator}
                                        onChange={e => setConditionDraft({...conditionDraft, operator: e.target.value})}
                                    >
                                        <option value=">">Maior que (&gt;)</option>
                                        <option value="<">Menor que (&lt;)</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <select 
                                        className="border p-1 rounded text-sm flex-1"
                                        value={conditionDraft.ref}
                                        onChange={e => setConditionDraft({...conditionDraft, ref: e.target.value})}
                                    >
                                        <option value="MAX">Limite MÁXIMO</option>
                                        <option value="MIN">Limite MÍNIMO</option>
                                        <option value="VALUE">Valor Fixo</option>
                                    </select>
                                    {conditionDraft.ref === 'VALUE' && (
                                        <input 
                                            type="number" 
                                            className="border p-1 rounded text-sm w-20"
                                            value={conditionDraft.value}
                                            onChange={e => setConditionDraft({...conditionDraft, value: parseFloat(e.target.value)})}
                                        />
                                    )}
                                </div>
                                <button onClick={addCondition} className="w-full bg-gray-200 text-gray-700 py-1 rounded text-sm font-bold hover:bg-gray-300">
                                    + Adicionar Condição
                                </button>
                            </div>

                            {/* Conditions Preview */}
                            {newRule.conditions.length > 0 && (
                                <div className="text-xs bg-purple-50 p-2 rounded border border-purple-100">
                                    {newRule.conditions.map((c, i) => (
                                        <div key={i}>{c.param} {c.operator} {c.ref === 'VALUE' ? c.value : c.ref}</div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-gray-500">Texto do Resultado (Laudo)</label>
                                <textarea 
                                    className="w-full border p-2 rounded h-20" 
                                    placeholder="Ex: Sugere quadro de insuficiência renal..."
                                    value={newRule.resultText}
                                    onChange={e => setNewRule({...newRule, resultText: e.target.value})}
                                />
                            </div>

                            <button 
                                onClick={saveRule}
                                className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700"
                            >
                                Salvar Regra
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
