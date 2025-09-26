import { getCars } from "@/lib/data";

// Komponen terpisah untuk menampilkan satu kartu mobil
function CarCard({ car }) {
  // Format harga ke dalam format Rupiah (IDR)
  const hargaFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(car.harga_sewa_per_hari);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        {/* Nanti kita akan ganti ini dengan gambar mobil asli */}
        <span className="text-gray-500">Gambar Mobil</span>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900">{car.brand} {car.model}</h3>
        <p className="text-gray-600 text-sm mt-1">Tahun {car.tahun}</p>
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-800">{hargaFormatted} / hari</p>
          <p className={`mt-2 text-sm font-medium capitalize py-1 px-2 inline-block rounded-full ${car.status === 'tersedia' ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'
            }`}>
            {car.status}
          </p>
        </div>
      </div>
    </div>
  );
}

// Halaman utama kita sekarang menjadi Async Component
export default async function Home() {
  // Memanggil fungsi untuk mengambil data mobil saat server merender halaman
  const { data: cars, error } = await getCars();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          Pilihan Mobil Terbaik
        </h1>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Jelajahi koleksi mobil kami yang terawat dan siap untuk menemani setiap perjalanan Anda.
        </p>

        {/* Menampilkan pesan error jika pengambilan data gagal */}
        {error && <p className="text-center text-red-500 font-medium">Error: {error}</p>}

        {/* Menampilkan pesan jika tidak ada data mobil */}
        {!error && !cars?.length && (
          <p className="text-center text-gray-600 mt-8">Saat ini tidak ada mobil yang tersedia.</p>
        )}

        {/* Menampilkan daftar mobil dalam bentuk grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cars && cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </main>
  );
}

