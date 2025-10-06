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
        // Cek apakah ada user yang sudah login saat aplikasi pertama kali dimuat
        const checkUser = async () => {
            try {
                const { data } = await api.get('/user');
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
            // 1. Ambil CSRF cookie dari Sanctum
            await api.get('/sanctum/csrf-cookie');

            // 2. Kirim request login
            await api.post('/login', { email, password });

            // 3. Ambil data user yang sudah login
            const { data } = await api.get('/user');
            setUser(data);

            // 4. Redirect ke dashboard admin
            router.push('/admin/dashboard');
        } catch (error) {
            // Tangani error login (misal: password salah)
            if (error.response && error.response.status === 422) {
                throw new Error('Email atau password salah.');
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error("Gagal logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => useContext(AuthContext);
