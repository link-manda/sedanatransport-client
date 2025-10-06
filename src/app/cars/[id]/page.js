'use client';

import { useState, useEffect } from 'react';

// Komponen Form terpisah (dengan styling dark mode)
function BookingForm({ carId, carStatus, onSuccess }) {
    const [formData, setFormData] = useState({
        nama_pelanggan: '', email_pelanggan: '', telepon_pelanggan: '',
        alamat_pelanggan: '', ktp_pelanggan: '', tanggal_mulai: '', tanggal_selesai: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const payload = { car_id: carId, ...formData };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });
            const responseData = await res.json();
            if (!res.ok) {
                let errorMessage = responseData.message || 'Terjadi kesalahan.';
                if (responseData.errors) {
                    errorMessage = Object.values(responseData.errors).flat().join('\n');
                }
                throw new Error(errorMessage);
            }
            onSuccess();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (carStatus !== 'tersedia') {
        return (
            <div className="bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg" role="alert">
                <p className="font-bold">Mobil Tidak Tersedia</p>
                <p>Mobil ini sedang tidak dapat disewa saat ini.</p>
            </div>
        );
    }

    // Kelas dasar untuk input
    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
                <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-4 rounded-lg" role="alert">
                    <p className="font-bold">Gagal Memesan:</p>
                    <pre className="whitespace-pre-wrap text-sm mt-1">{submitError}</pre>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                    <input type="text" name="nama_pelanggan" value={formData.nama_pelanggan} onChange={handleInputChange} className={inputClasses} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Email</label>
                    <input type="email" name="email_pelanggan" value={formData.email_pelanggan} onChange={handleInputChange} className={inputClasses} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Telepon</label>
                    <input type="text" name="telepon_pelanggan" value={formData.telepon_pelanggan} onChange={handleInputChange} className={inputClasses} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor KTP</label>
                    <input type="text" name="ktp_pelanggan" value={formData.ktp_pelanggan} onChange={handleInputChange} className={inputClasses} required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap</label>
                <textarea name="alamat_pelanggan" value={formData.alamat_pelanggan} onChange={handleInputChange} className={inputClasses} rows="3" required></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Mulai</label>
                    <input type="date" name="tanggal_mulai" value={formData.tanggal_mulai} onChange={handleInputChange} className={inputClasses} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Selesai</label>
                    <input type="date" name="tanggal_selesai" value={formData.tanggal_selesai} onChange={handleInputChange} className={inputClasses} required />
                </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-300 text-lg">
                {isSubmitting ? 'Memproses...' : 'Sewa Sekarang'}
            </button>
        </form>
    );
}

// Komponen utama halaman
export default function CarDetailPage({ params }) {
    // Tidak ada perubahan signifikan pada logika, hanya styling
    const { id } = params;
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        if (!id) return;
        async function fetchCar() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/cars/${id}`);
                if (!res.ok) throw new Error('Mobil tidak ditemukan.');
                const data = await res.json();
                setCar(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCar();
    }, [id]);

    if (loading) return <div className="text-center py-20"><p className="text-lg">Memuat data mobil...</p></div>;
    if (error) return <div className="text-center py-20"><p className="text-lg text-red-600 font-semibold">Error: {error}</p></div>;
    if (!car) return <div className="text-center py-20"><p className="text-lg">Data mobil tidak dapat ditemukan.</p></div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                <div className="lg:col-span-3">
                    <div className="bg-gray-200 dark:bg-gray-800 aspect-video rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17l6-6-6-6" /></svg>
                        <span className="text-gray-500 dark:text-gray-400 text-xl">Gambar Mobil</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{car.brand} {car.model}</h1>
                    <p className="text-2xl text-gray-500 dark:text-gray-400 mt-1">{car.tahun}</p>
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                        <p className="text-lg flex justify-between">
                            <span className="font-semibold text-gray-600 dark:text-gray-300">Plat Nomor:</span>
                            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{car.plat_nomor}</span>
                        </p>
                        <p className="text-lg flex justify-between items-center">
                            <span className="font-semibold text-gray-600 dark:text-gray-300">Status:</span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${car.status === 'tersedia' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                            </span>
                        </p>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 text-right">
                                Rp {new Intl.NumberFormat('id-ID').format(car.harga_sewa_per_hari)}
                                <span className="text-base font-normal text-gray-500 dark:text-gray-400"> / hari</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800/50 dark:ring-1 dark:ring-white/10 p-6 sm:p-8 rounded-xl shadow-lg sticky top-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Formulir Pemesanan</h2>

                        {bookingSuccess ? (
                            <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-800 dark:text-green-300 p-4 rounded-lg" role="alert">
                                <p className="font-bold text-lg">Pemesanan Berhasil!</p>
                                <p className="mt-1">Terima kasih, pesanan Anda telah kami terima. Anda akan segera kami hubungi untuk konfirmasi lebih lanjut.</p>
                            </div>
                        ) : (
                            <BookingForm carId={parseInt(id, 10)} carStatus={car.status} onSuccess={() => setBookingSuccess(true)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

