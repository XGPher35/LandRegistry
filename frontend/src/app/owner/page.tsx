"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import toast from "react-hot-toast";
import LandCard from "@/components/LandCard";
import idl from "@/idl/land_registry.json";
import {
    User,
    MapPin,
    ArrowRightLeft,
    Clock,
    RefreshCw,
    Wallet,
    AlertCircle,
    CheckCircle,
    XCircle,
    Send,
    FileCheck,
} from "lucide-react";

const PROGRAM_ID = new PublicKey("71SzaqeYfGgPp6X6ajhZzvUwDCd1R8GxYrkHchwrBoUp");

export default function OwnerPortal() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [mounted, setMounted] = useState(false);
    const [myLands, setMyLands] = useState<any[]>([]);
    const [incomingTransfers, setIncomingTransfers] = useState<any[]>([]);
    const [outgoingTransfers, setOutgoingTransfers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (wallet.publicKey) {
            fetchMyData();
            connection.getBalance(wallet.publicKey).then((bal) =>
                setBalance(bal / web3.LAMPORTS_PER_SOL)
            );
        } else {
            setMyLands([]);
            setIncomingTransfers([]);
            setOutgoingTransfers([]);
            setBalance(null);
        }
    }, [wallet.publicKey, connection]);

    const fetchMyData = async () => {
        if (!wallet.publicKey) return;
        setIsLoading(true);

        try {
            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(idl as any, provider);

            // Fetch all lands and filter by owner
            const allLands = await (program.account as any).land.all();
            const owned = allLands.filter(
                (land: any) => land.account.owner.toString() === wallet.publicKey?.toString()
            );
            setMyLands(owned);

            // Fetch all transfer requests
            const allTransfers = await (program.account as any).transferRequest.all();

            // Incoming: where I am the buyer and it's pending my approval
            const incoming = allTransfers.filter((req: any) => {
                const status = req.account.status;
                const isPending = status.pending !== undefined;
                return (
                    req.account.buyer.toString() === wallet.publicKey?.toString() &&
                    isPending &&
                    !req.account.isBuyerApproved
                );
            });
            setIncomingTransfers(incoming);

            // Outgoing: where I am the seller and status is pending
            const outgoing = allTransfers.filter((req: any) => {
                const status = req.account.status;
                const isPending = status.pending !== undefined;
                return (
                    req.account.seller.toString() === wallet.publicKey?.toString() &&
                    isPending
                );
            });
            setOutgoingTransfers(outgoing);

        } catch (err) {
            console.error("Error fetching data:", err);
            toast.error("Failed to fetch your data");
        } finally {
            setIsLoading(false);
        }
    };

    const approveTransfer = async (requestPublicKey: PublicKey, landId: any) => {
        const loadingToast = toast.loading("Approving transfer...");
        try {
            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(idl as any, provider);

            const id = new BN(landId);
            const [landPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("land"), id.toArrayLike(Buffer, "le", 8)],
                PROGRAM_ID
            );

            await program.methods
                .approveTransfer()
                .accounts({
                    transferRequest: requestPublicKey,
                    land: landPda,
                    signer: wallet.publicKey,
                } as any)
                .rpc();

            toast.success("Transfer approved! Waiting for government approval.", { id: loadingToast });
            fetchMyData();
        } catch (err) {
            console.error(err);
            toast.error("Approval failed: " + (err as Error).message, { id: loadingToast });
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">My Land Portfolio</h1>
                            <p className="text-white/80 mt-1">View and manage your land holdings</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {balance !== null && (
                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                                    <Wallet className="w-4 h-4" />
                                    <span className="font-mono font-medium">{balance.toFixed(2)} SOL</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Not Connected State */}
                {!wallet.publicKey ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center -mt-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <User className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Connect Your Wallet
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Connect your Solana wallet to view your land holdings, pending transfers,
                            and manage your properties.
                        </p>
                        <div className="flex justify-center">
                            <WalletMultiButton />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 -mt-8">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">My Lands</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {myLands.length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Incoming Transfers</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {incomingTransfers.length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                                        <ArrowRightLeft className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Outgoing Transfers</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {outgoingTransfers.length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <Send className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Refresh Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={fetchMyData}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                                Refresh
                            </button>
                        </div>

                        {/* Incoming Transfers (Need Approval) */}
                        {incomingTransfers.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                            <ArrowRightLeft className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Incoming Transfers
                                            </h2>
                                            <p className="text-sm text-gray-500">Land being transferred to you - needs your approval</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {incomingTransfers.map((req) => (
                                        <div
                                            key={req.publicKey.toString()}
                                            className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-xl p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Land #{req.account.landId.toString()}
                                                </span>
                                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                                                    Awaiting Your Approval
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                                                <p>
                                                    <span className="text-gray-500">From:</span>{" "}
                                                    <span className="font-mono">
                                                        {req.account.seller.toString().slice(0, 8)}...{req.account.seller.toString().slice(-4)}
                                                    </span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => approveTransfer(req.publicKey, req.account.landId)}
                                                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve & Accept Land
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Outgoing Transfers (Waiting) */}
                        {outgoingTransfers.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                            <Send className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Outgoing Transfers
                                            </h2>
                                            <p className="text-sm text-gray-500">Land you're transferring - waiting for approvals</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {outgoingTransfers.map((req) => (
                                        <div
                                            key={req.publicKey.toString()}
                                            className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Land #{req.account.landId.toString()}
                                                </span>
                                                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    In Progress
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                                                <p>
                                                    <span className="text-gray-500">To:</span>{" "}
                                                    <span className="font-mono">
                                                        {req.account.buyer.toString().slice(0, 8)}...{req.account.buyer.toString().slice(-4)}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className={req.account.isBuyerApproved ? "text-green-600" : "text-gray-400"}>
                                                    {req.account.isBuyerApproved ? "✓ Buyer approved" : "○ Buyer pending"}
                                                </span>
                                                <span className={req.account.isGovApproved ? "text-green-600" : "text-gray-400"}>
                                                    {req.account.isGovApproved ? "✓ Gov approved" : "○ Gov pending"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* My Lands */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <FileCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            My Land Holdings
                                        </h2>
                                        <p className="text-sm text-gray-500">{myLands.length} properties registered to your wallet</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {myLands.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                                        <p className="text-gray-500 dark:text-gray-400">No lands registered to your wallet</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            Lands registered by the government to your wallet will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {myLands.map((land) => (
                                            <LandCard
                                                key={land.publicKey.toString()}
                                                id={land.account.id.toString()}
                                                location={land.account.location}
                                                area={land.account.area}
                                                owner={land.account.owner.toString()}
                                                isVerified={land.account.isVerified}
                                                transferCount={Number(land.account.transferCount)}
                                                showActions={true}
                                                onClick={() => window.location.href = `/public?id=${land.account.id.toString()}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
