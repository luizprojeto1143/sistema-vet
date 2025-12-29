import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simular verificação de token no localStorage
        const storedUser = localStorage.getItem('vet_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock de login - Futuramente baterá na API Node
        // Simula delay de rede
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@vet.com' && password === '123456') {
                    const userData = { name: 'Dr. Admin', email, role: 'admin', avatar: null };
                    setUser(userData);
                    localStorage.setItem('vet_user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('Credenciais inválidas'));
                }
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vet_user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
