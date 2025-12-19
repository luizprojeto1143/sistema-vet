"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function InternmentFolio() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showVitals, setShowVitals] = useState(false);

    // States for Vitals
    const [temp, setTemp] = useState('');
    const [bpm, setBpm] = useState('');
    const [mpm, setMpm] = useState('');

    // States for New Prescription
    const [medName, setMedName] = useState('');
    const [dosage, setDosage] = useState('');
    const [freq, setFreq] = useState('');

    // States for Daily Record
    const [humor, setHumor] = useState('NORMAL');
    const [note, setNote] = useState('');
    const [checks, setChecks] = useState({ feed: false, water: false, urine: false, feces: false });

    const fetchDetails = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/internment/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setData(await res.json());
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handlePrescribe = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/prescribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                internmentId: id,
                medicationName: medName,
                dosage,
                frequency: freq,
                duration: 'Continuo',
                prescribedById: 'user-id-placeholder'
            })
        });
        setMedName(''); setDosage(''); setFreq('');
        fetchDetails();
    };

    const handleExecute = async (prescriptionId: string) => {
        const token = localStorage.getItem('token');
        if (!confirm('Confirmar aplicação da medicação? Isso baixará do estoque.')) return;

        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/execute-medication', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                prescriptionId,
                executedById: 'user-id-placeholder',
                notes: 'Aplicado via sistema'
            })
        });
        fetchDetails();
    };

    const handleVitalSign = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/vital-sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                internmentId: id,
                temperature: temp,
                heartRate: bpm,
                respiratoryRate: mpm,
                recordedById: 'user-id-placeholder'
            })
        });
        setTemp(''); setBpm(''); setMpm(''); setShowVitals(false);
        alert('Sinais Vitais registrados!');
        // Ideally refetch vitals if we displayed them
    };

    const handleDailyRecord = async () => {
        const token = localStorage.getItem('token');
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/daily-record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                internmentId: id,
                ...checks,
                humor,
                notes: note,
            })
        });
        setNote('');
        alert('Boletim Salvo com sucesso! Enviando para o Tutor...');
        fetchDetails();
    };

    const handleDischarge = async () => {
        if (!confirm('Tem certeza que deseja dar ALTA a este paciente?')) return;
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/internment/${id}/discharge`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        router.push('/internment');
    };

    if (loading) return <div className="p-8">Carregando prontuário...</div>;
    if (!data) return <div className="p-8">Internação não encontrada.</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                        {data.pet?.species === 'CAT' ? '🐱' : '🐶'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{data.pet?.name}</h1>
                        <p className="text-gray-500">Tutor: {data.pet?.tutor?.fullName} • Leito: {data.bedNumber}</p>
                        <div className="mt-2 text-sm bg-red-100 text-red-800 inline-block px-2 py-1 rounded">
                            Motivo: {data.reason}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowVitals(!showVitals)} className="bg-purple-100 text-purple-700 px-4 py-2 rounded font-bold hover:bg-purple-200">
                        📊 Sinais Vitais
                    </button>
                    <button onClick={handleDischarge} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">
                        ✅ Dar Alta
                    </button>
                </div>
            </div>

            {/* Vitals Modal */}
            {showVitals && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl w-96">
                        <h3 className="font-bold text-xl mb-4">Registrar Sinais Vitais</h3>
                        <form onSubmit={handleVitalSign} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Temperatura (°C)</label>
                                <input type="number" step="0.1" className="w-full border p-2 rounded" value={temp} onChange={e => setTemp(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Freq. Cardíaca (BPM)</label>
                                <input type="number" className="w-full border p-2 rounded" value={bpm} onChange={e => setBpm(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Freq. Respiratória (MPM)</label>
                                <input type="number" className="w-full border p-2 rounded" value={mpm} onChange={e => setMpm(e.target.value)} required />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowVitals(false)} className="flex-1 bg-gray-200 py-2 rounded font-bold">Cancelar</button>
                                <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded font-bold">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Prescriptions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            💊 Prescrições Ativas
                        </h2>

                        <div className="space-y-4">
                            {data.prescriptions?.map((p: any) => (
                                <div key={p.id} className="border p-4 rounded-lg flex justify-between items-center bg-gray-50">
                                    <div>
                                        <p className="font-bold text-lg">{p.medicationName} <span className="text-sm font-normal text-gray-500">({p.dosage})</span></p>
                                        <p className="text-sm text-gray-600">Frequência: {p.frequency}</p>

                                        {/* Executions History */}
                                        <div className="mt-2 flex gap-1 flex-wrap">
                                            {p.executions?.map((exec: any) => (
                                                <span key={exec.id} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded" title={exec.executedAt}>
                                                    ✔ Feito {new Date(exec.executedAt).toLocaleTimeString().slice(0, 5)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleExecute(p.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                                    >
                                        💉 APLIQUEI
                                    </button>
                                </div>
                            ))}
                            {data.prescriptions?.length === 0 && <p className="text-gray-400 italic">Nenhuma prescrição ativa.</p>}
                        </div>

                        {/* Add Prescription Form */}
                        <form onSubmit={handlePrescribe} className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-2">Adicionar Prescrição</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <input placeholder="Medicamento" className="border p-2 rounded" value={medName} onChange={e => setMedName(e.target.value)} required />
                                <input placeholder="Dose (ex: 2ml)" className="border p-2 rounded" value={dosage} onChange={e => setDosage(e.target.value)} required />
                                <input placeholder="Freq (ex: 8h em 8h)" className="border p-2 rounded" value={freq} onChange={e => setFreq(e.target.value)} required />
                            </div>
                            <button type="submit" className="mt-2 w-full bg-gray-800 text-white py-2 rounded font-medium hover:bg-black">Adicionar</button>
                        </form>
                    </div>
                </div>

                {/* Right: Daily Records / Vitals */}
                <div className="space-y-6">
                    {/* Vitals Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">📈 Evolução (Sinais Vitais)</h2>
                        {data.vitalSigns?.length > 0 ? (
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.vitalSigns}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="dateTime" tickFormatter={(t) => new Date(t).toLocaleTimeString().slice(0, 5)} />
                                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                                        <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
                                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temp (°C)" strokeWidth={2} />
                                        <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" name="FC (bpm)" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Nenhum sinal vital registrado.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">📝 Novo Boletim</h2>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={checks.feed} onChange={e => setChecks({ ...checks, feed: e.target.checked })} />
                                🍖 Comeu
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={checks.water} onChange={e => setChecks({ ...checks, water: e.target.checked })} />
                                💧 Bebeu
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={checks.urine} onChange={e => setChecks({ ...checks, urine: e.target.checked })} />
                                🟡 Xixi
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={checks.feces} onChange={e => setChecks({ ...checks, feces: e.target.checked })} />
                                💩 Cocô
                            </label>
                        </div>

                        <select className="w-full border p-2 rounded mb-4" value={humor} onChange={e => setHumor(e.target.value)}>
                            <option value="ANIMATED">😊 Animado</option>
                            <option value="NORMAL">😐 Normal</option>
                            <option value="DEPRESSED">😔 Deprimido</option>
                            <option value="AGGRESSIVE">😠 Agressivo</option>
                        </select>

                        <textarea
                            placeholder="Evolução clínica..."
                            className="w-full border p-2 rounded h-24 mb-4"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />

                        <button
                            onClick={handleDailyRecord}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            💌 Salvar e Enviar ao Tutor
                        </button>

                        <div className="mt-8">
                            <h3 className="font-bold text-gray-700 mb-2">Histórico de Hoje</h3>
                            <ul className="space-y-3">
                                {data.dailyRecords?.map((rec: any) => (
                                    <li key={rec.id} className="text-sm border-b pb-2">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-600">{new Date(rec.date).toLocaleTimeString().slice(0, 5)}</span>
                                            <span className="text-gray-400 text-xs text-right">Humor: {rec.humor}</span>
                                        </div>
                                        <p className="text-gray-500 mt-1 italic">"{rec.notes}"</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
