"use client";

import { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import InitiateTransfer from "@/components/InitiateTransfer";
import {
    Search,
    MapPin,
    Square,
    User,
    CheckCircle,
    Clock,
    ExternalLink,
    Copy,
    Share2,
    Printer,
    Shield,
    AlertCircle,
    ArrowRight,
    FileText,
    History,
} from "lucide-react";

import idl from "@/idl/land_registry.json";

const PROGRAM_ID = new PublicKey("71SzaqeYfGgPp6X6ajhZzvUwDCd1R8GxYrkHchwrBoUp");

export default function PublicPortal() {
    const { connection } = useConnection();

    const [searchId, setSearchId] = useState("");
    const [landData, setLandData] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const fetchHistory = async (landPda: PublicKey) => {
        try {
            const signatures = await connection.getSignaturesForAddress(landPda, { limit: 20 });
            const historyData = [];

            for (const sigInfo of signatures) {
                const tx = await connection.getParsedTransaction(sigInfo.signature, { maxSupportedTransactionVersion: 0 });
                if (tx && tx.meta && tx.meta.logMessages) {
                    historyData.push({
                        signature: sigInfo.signature,
                        slot: sigInfo.slot,
                        blockTime: sigInfo.blockTime,
                        logs: tx.meta.logMessages,
                        status: "Confirmed"
                    });
                }
            }
            setHistory(historyData);
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    const verifyLand = async () => {
        if (!searchId.trim()) {
            toast.error("Please enter a Land ID");
            return;
        }

        setLoading(true);
        setError("");
        setLandData(null);
        setHistory([]);

        try {
            const provider = new AnchorProvider(connection, {} as any, {});
            const program = new Program(idl as any, provider);

            const id = new BN(searchId);
            const [landPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("land"), id.toArrayLike(Buffer, "le", 8)],
                PROGRAM_ID
            );

            const account = await (program.account as any).land.fetch(landPda);
            setLandData(account);

            await fetchHistory(landPda);
            toast.success("Land record verified!");

        } catch (err) {
            console.error(err);
            setError("Land not found. Please check the ID and try again.");
            toast.error("Land not found");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const getLandUrl = () => {
        return `${window.location.origin}/public?id=${searchId}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Public Verification Portal</h1>
                    <p className="text-lg text-white/80 max-w-xl mx-auto">
                        Instantly verify land ownership and view complete transfer history.
                        No account needed - anyone can verify.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Box */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 -mt-12 relative z-10 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                placeholder="Enter Land ID (e.g., 12345)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && verifyLand()}
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <button
                            onClick={verifyLand}
                            disabled={loading}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Verify
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Results */}
                {landData && (
                    <div className="mt-8 space-y-6 animate-slide-up">
                        {/* Main Result Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                Verified Land Record
                                            </h2>
                                            <p className="text-sm text-gray-500">Land ID: #{landData.id.toString()}</p>
                                        </div>
                                    </div>
                                    {landData.isVerified && (
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full flex items-center gap-1">
                                            <Shield className="w-4 h-4" />
                                            Government Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {landData.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <Square className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {landData.area} sq ft
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Transfers</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {landData.transferCount.toString()} transfers
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Owner</p>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(landData.owner.toString())}
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                                    title="Copy address"
                                                >
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                                                {landData.owner.toString()}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setShowQR(!showQR)}
                                                className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Share2 className="w-4 h-4" />
                                                {showQR ? "Hide QR" : "Show QR"}
                                            </button>
                                            <button
                                                onClick={() => window.print()}
                                                className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Printer className="w-4 h-4" />
                                                Print
                                            </button>
                                        </div>

                                        {/* QR Code */}
                                        {showQR && (
                                            <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl flex flex-col items-center gap-3">
                                                <QRCodeSVG
                                                    value={getLandUrl()}
                                                    size={150}
                                                    level="H"
                                                    includeMargin
                                                    className="rounded-lg"
                                                />
                                                <p className="text-xs text-gray-500 text-center">
                                                    Scan to verify this land record
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Transfer Action */}
                                <InitiateTransfer
                                    landId={searchId}
                                    landTransferCount={landData.transferCount}
                                    owner={landData.owner.toString()}
                                    onSuccess={verifyLand}
                                />
                            </div>
                        </div>

                        {/* History Section */}
                        {history.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                    <History className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Blockchain History
                                    </h3>
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                        {history.length} transactions
                                    </span>
                                </div>

                                <div className="p-6">
                                    <div className="relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-blue-500" />

                                        <div className="space-y-6">
                                            {history.map((tx, index) => (
                                                <div key={tx.signature} className="relative pl-10">
                                                    {/* Timeline dot */}
                                                    <div className="absolute left-2 top-1 w-4 h-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full border-2 border-white dark:border-gray-800" />

                                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                    {index === 0 ? "Latest Transaction" : `Transaction #${history.length - index}`}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {tx.blockTime
                                                                        ? new Date(tx.blockTime * 1000).toLocaleString()
                                                                        : "Unknown Date"
                                                                    }
                                                                </p>
                                                            </div>
                                                            <a
                                                                href={`https://explorer.solana.com/tx/${tx.signature}?cluster=custom&customUrl=http://127.0.0.1:8899`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
                                                            >
                                                                Explorer
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-gray-400" />
                                                            <p className="font-mono text-xs text-gray-500 truncate" title={tx.signature}>
                                                                {tx.signature.slice(0, 20)}...{tx.signature.slice(-8)}
                                                            </p>
                                                            <button
                                                                onClick={() => copyToClipboard(tx.signature)}
                                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                                            >
                                                                <Copy className="w-3 h-3 text-gray-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Help Section */}
                {!landData && !error && (
                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            How to Verify Land Ownership
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-lg font-bold text-green-600">1</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Enter the Land ID you want to verify
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-lg font-bold text-green-600">2</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Click "Verify" to search the blockchain
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-lg font-bold text-green-600">3</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    View ownership details and history
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
