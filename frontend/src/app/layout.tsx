import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "../components/AppWalletProvider";
import ToastProvider from "../components/ToastProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nepal Land Registry | Mero Maato, Mero Adhikar",
  description: "A secure, immutable, and transparent land ownership system built on Solana blockchain. Verify land ownership, track transfers, and prevent fraud.",
  keywords: ["land registry", "nepal", "solana", "blockchain", "land ownership", "property verification"],
  authors: [{ name: "Nepal Land Registry Team" }],
  openGraph: {
    title: "Nepal Land Registry",
    description: "Secure blockchain-based land ownership system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AppWalletProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
