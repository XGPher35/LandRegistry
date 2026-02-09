import Link from "next/link";
import { Shield, Github, ExternalLink } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-blue-700 rounded-xl flex items-center justify-center">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Nepal Land Registry</h3>
                                <p className="text-sm text-gray-400">
                                    मेरो माटो, मेरो अधिकार
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            A secure, immutable, and transparent land ownership system built on Solana blockchain.
                            Protecting your land rights with the power of decentralization.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/public" className="hover:text-white transition-colors">Verify Land</Link>
                            </li>
                            <li>
                                <Link href="/owner" className="hover:text-white transition-colors">My Land</Link>
                            </li>
                            <li>
                                <Link href="/gov" className="hover:text-white transition-colors">Government Portal</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Built With */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Built With</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">Solana</span>
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">Anchor</span>
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">Next.js</span>
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">React</span>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <a
                                href="#"
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                title="View Source"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://explorer.solana.com/?cluster=custom&customUrl=http://127.0.0.1:8899"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                title="Solana Explorer"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © 2026 Nepal Land Registry. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-500">Powered by Solana</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
