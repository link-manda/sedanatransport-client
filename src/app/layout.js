import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar"; // Impor Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistem Rental Mobil",
  description: "Platform rental mobil terbaik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200`}>
        <AuthProvider>
          <Navbar /> {/* Gunakan komponen Navbar di sini */}

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

