export async function getCars() {
    try {
        // SOLUSI #1: Menggunakan nama environment variable yang benar
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/cars`;

        const response = await fetch(apiUrl, {
            cache: 'no-store',
        });

        if (!response.ok) {
            // Memberikan pesan error yang lebih spesifik
            throw new Error(`Gagal mengambil data: Status ${response.status}`);
        }

        const result = await response.json();

        // SOLUSI #2: Mengembalikan array yang ada di dalam properti 'data'
        return result.data;

    } catch (error) {
        console.error('Error fetching cars:', error);
        // Mengembalikan array kosong jika terjadi error agar tidak crash
        return [];
    }
}

// Fungsi ini sudah benar, tidak perlu diubah.
export async function getCarById(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/cars/${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Gagal mengambil data mobil.');
        }

        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

