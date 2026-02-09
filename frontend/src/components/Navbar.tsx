"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import {
    Home,
    Search,
    Building2,
    User,
    Menu,
    X,
    Shield
} from "lucide-react";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/public", label: "Verify Land", icon: Search },
    { href: "/owner", label: "My Land", icon: User },
    { href: "/gov", label: "Government", icon: Building2 },
];

export default function Navbar() {
    const pathname = usePathname();
    const wallet = useWallet();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                Nepal Land Registry
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                                Mero Maato, Mero Adhikar
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-gradient-to-r from-red-500/10 to-blue-500/10 text-blue-700 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Wallet & Network */}
                    <div className="flex items-center gap-3">
                        {/* Network Indicator */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                Localnet
                            </span>
                        </div>

                        {/* Wallet Button */}
                        {mounted && (
                            <div className="wallet-adapter-button-wrapper">
                                <WalletMultiButton />
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-gradient-to-r from-red-500/10 to-blue-500/10 text-blue-700 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-300"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
}
