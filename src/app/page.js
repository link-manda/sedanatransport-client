import { getCars } from "@/lib/data";
import Link from 'next/link';

export default async function Home() {
  const cars = await getCars();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pilihan Mobil Terbaik Kami</h1>

      {cars && cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            // PENTING: Pastikan href di sini benar, mengarah ke /cars/[id]
            <Link href={`/cars/${car.id}`} key={car.id} className="block group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <div className="h-56 bg-gray-200 flex items-center justify-center">
                  {/* Anda bisa menambahkan tag <img> di sini nanti */}
                  <span className="text-gray-500">Gambar Mobil</span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800">{car.brand} {car.model}</h2>
                  <p className="text-gray-600 mt-1">Tahun {car.tahun}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${car.status === 'tersedia'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {/* Mengubah 'tersedia' menjadi 'Tersedia' */}
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {car.harga_sewa_per_hari} / hari
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Saat ini tidak ada mobil yang tersedia.</p>
        </div>
      )}
    </main>
  );
}

