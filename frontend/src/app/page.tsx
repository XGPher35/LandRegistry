"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <header className="absolute top-0 right-0 p-4">
        <WalletMultiButton />
      </header>

      <main className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">
          Nepal Land Registry
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          A secure, immutable, and transparent land ownership system built on Solana.
        </p>

        <div className="flex gap-6 justify-center mt-12">
          <Link
            href="/gov"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Government Dashboard
          </Link>
          <Link
            href="/public"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Public Verification
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-0 p-4 text-gray-500">
        Powered by Solana & Anchor
      </footer>
    </div>
  );
}
