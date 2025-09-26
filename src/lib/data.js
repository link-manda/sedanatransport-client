export async function getCars() {
    try {
        // Menggunakan environment variable yang sudah kita set
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars`;

        const response = await fetch(apiUrl, {
            // Opsi ini memastikan kita selalu mendapat data terbaru saat development
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data mobil dari API');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching cars:', error);
        // Mengembalikan objek dengan properti error agar bisa ditangani di UI
        return { error: error.message };
    }
}

