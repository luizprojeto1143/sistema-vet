import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';

interface AutocompleteProps {
    placeholder?: string;
    onSearch: (query: string) => Promise<any[]>;
    onSelect: (item: any) => void;
    onCreateNew?: (query: string) => void;
    displayField: (item: any) => React.ReactNode;
    keyField?: string;
    label?: string;
}

export default function Autocomplete({
    placeholder = "Buscar...",
    onSearch,
    onSelect,
    onCreateNew,
    displayField,
    keyField = "id",
    label
}: AutocompleteProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [touched, setTouched] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    const data = await onSearch(query);
                    setResults(data || []);
                    setIsOpen(true);
                } catch (err) {
                    console.error("Search failed", err);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setTouched(true);
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 animate-spin" size={18} />
                )}
            </div>

            {isOpen && (touched || results.length > 0) && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                    {results.map(item => (
                        <div
                            key={item[keyField]}
                            onClick={() => {
                                onSelect(item);
                                setIsOpen(false);
                                setQuery(''); // Or keep name? Usually clear or set to selected name. 
                                // For this wizard, we probably want to clear to show "Selected: X" in parent or just clear for next.
                            }}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors text-sm"
                        >
                            {displayField(item)}
                        </div>
                    ))}

                    {results.length === 0 && !loading && (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                            Nenhum resultado encontrado.
                        </div>
                    )}

                    {onCreateNew && (
                        <div
                            onClick={() => {
                                onCreateNew(query);
                                setIsOpen(false);
                            }}
                            className="px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-t border-gray-100 flex items-center justify-center gap-2 text-sm font-bold text-teal-700 transition-colors sticky bottom-0"
                        >
                            <Plus size={16} />
                            Cadastrar Novo: "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
