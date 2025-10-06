'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await api.get('/api/user');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async ({ email, password }) => {
        try {
            await api.get('/sanctum/csrf-cookie');
            await api.post('/login', { email, password });

            const { data } = await api.get('/api/user');
            setUser(data);

            router.push('/admin/dashboard');
        } catch (error) {
            // --- LOGGING YANG LEBIH BAIK ---
            console.error('Login error object:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            // --- AKHIR LOGGING ---

            throw new Error('Gagal melakukan login. Periksa koneksi atau kredensial Anda. Cek console browser untuk detail.');
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error("Gagal logout:", error);
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);