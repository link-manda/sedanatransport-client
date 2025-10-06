import { getCars } from "@/lib/data";
import Link from 'next/link';

export default async function Home() {
  const cars = await getCars();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">Pilihan Mobil Terbaik Kami</h1>

      {cars && cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <Link href={`/cars/${car.id}`} key={car.id} className="block group">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-none dark:ring-1 dark:ring-white/10 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                <div className="h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17l6-6-6-6" />
                  </svg>
                  <span className="text-gray-500 dark:text-gray-400 text-lg">Gambar Mobil</span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{car.brand} {car.model}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Tahun {car.tahun}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${car.status === 'tersedia'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                      }`}>
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-500">
                      Rp {new Intl.NumberFormat('id-ID').format(car.harga_sewa_per_hari)}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/hari</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 dark:text-gray-400">Saat ini tidak ada mobil yang tersedia.</p>
        </div>
      )}
    </div>
  );
}

