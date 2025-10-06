'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
    const { user, loading, logout } = useAuth();

    return (
        <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                            SedanaTransport
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {!loading && (
                            <>
                                {user ? (
                                    <>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Halo, {user.name}
                                        </span>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                        Admin Login
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
