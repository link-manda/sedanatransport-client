'use client'; // Tandai sebagai Client Component

import { useState, useEffect } from 'react';

export default function CarDetailPage({ params }) {
    const { id } = params;
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk form
    const [formData, setFormData] = useState({
        nama_pelanggan: '',
        email_pelanggan: '',
        telepon_pelanggan: '',
        alamat_pelanggan: '',
        ktp_pelanggan: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        async function fetchCar() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/cars/${id}`);
                if (!res.ok) {
                    throw new Error('Mobil tidak ditemukan.');
                }
                const data = await res.json();
                setCar(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchCar();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        const payload = {
            car_id: parseInt(id, 10),
            ...formData,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (!res.ok) {
                // Tangani error validasi dari Laravel
                if (res.status === 422) {
                    const errors = Object.values(responseData.errors).flat().join('\n');
                    throw new Error(errors);
                }
                throw new Error(responseData.message || 'Terjadi kesalahan saat membuat pesanan.');
            }

            setSubmitSuccess(true);
            // Reset form jika berhasil
            setFormData({
                nama_pelanggan: '', email_pelanggan: '', telepon_pelanggan: '',
                alamat_pelanggan: '', ktp_pelanggan: '', tanggal_mulai: '', tanggal_selesai: '',
            });

        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Memuat data mobil...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
    if (!car) return <p className="text-center mt-10">Mobil tidak ditemukan.</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Kolom Detail Mobil */}
                <div>
                    <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center mb-6">
                        <span className="text-gray-500">Gambar Mobil</span>
                    </div>
                    <h1 className="text-4xl font-bold">{car.brand} {car.model}</h1>
                    <p className="text-xl text-gray-600 mt-2">Tahun {car.tahun}</p>
                    <div className="mt-4 border-t pt-4">
                        <p className="text-lg"><span className="font-semibold">Plat Nomor:</span> {car.plat_nomor}</p>
                        <p className="text-lg"><span className="font-semibold">Status:</span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${car.status === 'tersedia'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                            </span>
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-4">
                            Rp {car.harga_sewa_per_hari} <span className="text-lg font-normal">/ hari</span>
                        </p>
                    </div>
                </div>

                {/* Kolom Form Pemesanan */}
                <div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Formulir Pemesanan</h2>

                        {car.status !== 'tersedia' ? (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
                                <p className="font-bold">Mobil Tidak Tersedia</p>
                                <p>Mobil ini sedang tidak tersedia untuk disewa saat ini.</p>
                            </div>
                        ) : submitSuccess ? (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
                                <p className="font-bold">Pemesanan Berhasil!</p>
                                <p>Terima kasih, pesanan Anda telah kami terima. Kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {submitError && (
                                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4" role="alert">
                                        <p className="font-bold">Terjadi Kesalahan:</p>
                                        <pre className="whitespace-pre-wrap">{submitError}</pre>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input type="text" name="nama_pelanggan" value={formData.nama_pelanggan} onChange={handleInputChange} placeholder="Nama Lengkap" className="w-full p-3 border rounded-lg" required />
                                    <input type="email" name="email_pelanggan" value={formData.email_pelanggan} onChange={handleInputChange} placeholder="Alamat Email" className="w-full p-3 border rounded-lg" required />
                                    <input type="text" name="telepon_pelanggan" value={formData.telepon_pelanggan} onChange={handleInputChange} placeholder="Nomor Telepon" className="w-full p-3 border rounded-lg" required />
                                    <input type="text" name="ktp_pelanggan" value={formData.ktp_pelanggan} onChange={handleInputChange} placeholder="Nomor KTP" className="w-full p-3 border rounded-lg" required />
                                </div>
                                <textarea name="alamat_pelanggan" value={formData.alamat_pelanggan} onChange={handleInputChange} placeholder="Alamat Lengkap" className="w-full p-3 border rounded-lg mb-4" rows="3" required></textarea>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                        <input type="date" name="tanggal_mulai" value={formData.tanggal_mulai} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                        <input type="date" name="tanggal_selesai" value={formData.tanggal_selesai} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
                                    </div>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold p-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-300">
                                    {isSubmitting ? 'Memproses...' : 'Sewa Sekarang'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
