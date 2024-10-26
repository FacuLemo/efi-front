import Navigation from "@/components/Navigation";
import localFont from "next/font/local";
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Plataforma de juegos",
  description: "EFI Programacion III",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navigation></Navigation>
          <div className="mt-[90px]">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
