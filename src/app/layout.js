import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Impor AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistem Rental Mobil",
  description: "Platform rental mobil terbaik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200`}>
        {/* Bungkus semua dengan AuthProvider */}
        <AuthProvider>
          <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0">
                  <a href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                    SedanaTransport
                  </a>
                </div>
                {/* Kita akan tambahkan tombol login/logout di sini nanti */}
              </div>
            </nav>
          </header>

          <main className="py-8 sm:py-12">
            {children}
          </main>

          <footer className="bg-white dark:bg-gray-900 mt-12 py-6 border-t dark:border-gray-700">
            <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} SedanaTransport. Hak Cipta Dilindungi.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

