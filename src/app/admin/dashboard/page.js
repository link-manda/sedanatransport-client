'use client';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Anda tidak memiliki akses. Silakan login.</p>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Selamat Datang, {user.name}!</h1>
            <p className="mt-2 text-lg">Ini adalah halaman dashboard admin Anda.</p>
        </div>
    );
}
