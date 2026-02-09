"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import idl from "@/idl/land_registry.json";
import StatCard from "@/components/StatCard";
import LandCard from "@/components/LandCard";
import {
    MapPin,
    FileCheck,
    Clock,
    TrendingUp,
    Plus,
    RefreshCw,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    Settings,
    Wallet,
} from "lucide-react";

const PROGRAM_ID = new PublicKey("71SzaqeYfGgPp6X6ajhZzvUwDCd1R8GxYrkHchwrBoUp");

export default function GovernmentDashboard() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [landId, setLandId] = useState("");
    const [location, setLocation] = useState("");
    const [area, setArea] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [pendingTransfers, setPendingTransfers] = useState<any[]>([]);
    const [allLands, setAllLands] = useState<any[]>([]);
    const [showAllLands, setShowAllLands] = useState(false);
    const [showDevTools, setShowDevTools] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoadingLands, setIsLoadingLands] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!wallet.publicKey) {
            setBalance(null);
            return;
        }
        connection.getBalance(wallet.publicKey).then((bal) => setBalance(bal / web3.LAMPORTS_PER_SOL));
    }, [wallet.publicKey, connection]);

    const fetchAllLands = async () => {
        if (!wallet.publicKey) return;
        setIsLoadingLands(true);
        try {
            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(idl as any, provider);
            const lands = await (program.account as any).land.all();
            setAllLands(lands);
        } catch (err) {
            console.error("Error fetching lands:", err);
            toast.error("Failed to fetch lands");
        } finally {
            setIsLoadingLands(false);
        }
    };

    const registerLand = async () => {
        if (!wallet.publicKey) {
            toast.error("Connect wallet first!");
            return;
        }

        if (!landId || !location || !area) {
            toast.error("Please fill all fields");
            return;
        }

        setIsRegistering(true);
        const loadingToast = toast.loading("Registering land on blockchain...");

        try {
            const provider = new AnchorProvider(connection, wallet as any, {});
            const prog = new Program(idl as any, provider);

            const id = new BN(landId);
            const [landPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("land"), id.toArrayLike(Buffer, "le", 8)],
                PROGRAM_ID
            );

            await prog.methods
                .registerLand(id, location, area)
                .accounts({
                    land: landPda,
                    owner: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            toast.success("Land registered successfully!", { id: loadingToast });
            setLandId("");
            setLocation("");
            setArea("");
            fetchAllLands();

            // Refresh balance
            const bal = await connection.getBalance(wallet.publicKey);
            setBalance(bal / web3.LAMPORTS_PER_SOL);
        } catch (err) {
            console.error(err);
            toast.error("Registration failed: " + (err as Error).message, { id: loadingToast });
        } finally {
            setIsRegistering(false);
        }
    };

    const fetchPendingTransfers = async () => {
        if (!wallet.publicKey) return;
        try {
            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(idl as any, provider);

            const allRequests = await (program.account as any).transferRequest.all();

            const pending = allRequests.filter((req: any) => {
                const status = req.account.status;
                const isPending = status.pending !== undefined || status === "pending" || JSON.stringify(status).includes("pending");
                return isPending && !req.account.isGovApproved;
            });

            setPendingTransfers(pending);
        } catch (err) {
            console.error("Error fetching transfers:", err);
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

            toast.success("Transfer approved!", { id: loadingToast });
            fetchPendingTransfers();
        } catch (err) {
            console.error(err);
            toast.error("Approval failed: " + (err as Error).message, { id: loadingToast });
        }
    };

    useEffect(() => {
        if (wallet.publicKey) {
            fetchPendingTransfers();
            fetchAllLands();
        }
    }, [wallet.publicKey]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-blue-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Government Dashboard</h1>
                            <p className="text-white/80 mt-1">Manage land registrations and transfer approvals</p>
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
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16">
                    <StatCard
                        title="Total Lands"
                        value={allLands.length}
                        icon={MapPin}
                        gradient="from-red-500 to-red-600"
                    />
                    <StatCard
                        title="Pending Transfers"
                        value={pendingTransfers.length}
                        icon={Clock}
                        gradient="from-yellow-500 to-orange-500"
                    />
                    <StatCard
                        title="Verified Lands"
                        value={allLands.filter(l => l.account.isVerified).length}
                        icon={FileCheck}
                        gradient="from-green-500 to-green-600"
                    />
                    <StatCard
                        title="Total Transfers"
                        value={allLands.reduce((sum, l) => sum + Number(l.account.transferCount), 0)}
                        icon={TrendingUp}
                        gradient="from-blue-500 to-blue-600"
                    />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Registration Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Register New Land</h2>
                                    <p className="text-sm text-gray-500">Add verified land records to blockchain</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Land ID (Numeric)
                                </label>
                                <input
                                    type="number"
                                    value={landId}
                                    onChange={(e) => setLandId(e.target.value)}
                                    placeholder="e.g., 12345"
                                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Kathmandu, Ward 3"
                                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Area (sq ft)
                                </label>
                                <input
                                    type="text"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    placeholder="e.g., 1500"
                                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <button
                                onClick={registerLand}
                                disabled={isRegistering || !wallet.publicKey}
                                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-blue-700 hover:from-red-700 hover:to-blue-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isRegistering ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Register Land
                                    </>
                                )}
                            </button>

                            {!wallet.publicKey && (
                                <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    Connect wallet to register land
                                </p>
                            )}
                        </div>

                        {/* Dev Tools (Hidden by default) */}
                        <div className="border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowDevTools(!showDevTools)}
                                className="w-full px-6 py-3 flex items-center justify-between text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    <span className="text-sm">Developer Tools</span>
                                </div>
                                {showDevTools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showDevTools && (
                                <div className="p-6 pt-0 space-y-4">
                                    <button
                                        onClick={async () => {
                                            if (!wallet.publicKey) return;
                                            const loadingToast = toast.loading("Requesting airdrop...");
                                            try {
                                                const signature = await connection.requestAirdrop(wallet.publicKey, 2 * web3.LAMPORTS_PER_SOL);
                                                await connection.confirmTransaction(signature, "confirmed");
                                                toast.success("Airdrop successful! 2 SOL added.", { id: loadingToast });
                                                const bal = await connection.getBalance(wallet.publicKey);
                                                setBalance(bal / web3.LAMPORTS_PER_SOL);
                                            } catch (err) {
                                                console.error(err);
                                                toast.error("Airdrop failed: " + (err as Error).message, { id: loadingToast });
                                            }
                                        }}
                                        disabled={!wallet.publicKey}
                                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                                    >
                                        Request Airdrop (2 SOL)
                                    </button>
                                    <p className="text-xs text-gray-500 text-center">
                                        Use this for testing on Localnet if you get "insufficient funds" errors.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Transfers */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Transfers</h2>
                                    <p className="text-sm text-gray-500">{pendingTransfers.length} awaiting approval</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchPendingTransfers}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[500px] overflow-y-auto">
                            {pendingTransfers.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
                                    <p className="text-gray-500 dark:text-gray-400">No pending transfers</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All transfer requests have been processed</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingTransfers.map((req) => (
                                        <div
                                            key={req.publicKey.toString()}
                                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                                                        Pending
                                                    </span>
                                                    <span className="text-sm text-gray-500">Land #{req.account.landId.toString()}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Seller:</span>
                                                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                                                        {req.account.seller.toString().slice(0, 8)}...{req.account.seller.toString().slice(-4)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Buyer:</span>
                                                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                                                        {req.account.buyer.toString().slice(0, 8)}...{req.account.buyer.toString().slice(-4)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className={`text-xs ${req.account.isBuyerApproved ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {req.account.isBuyerApproved ? '✓ Buyer approved' : '○ Buyer pending'}
                                                    </span>
                                                    <span className={`text-xs ${req.account.isGovApproved ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {req.account.isGovApproved ? '✓ Gov approved' : '○ Gov pending'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => approveTransfer(req.publicKey, req.account.landId)}
                                                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Approve
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* All Registered Lands */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <button
                        onClick={() => setShowAllLands(!showAllLands)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Registered Lands</h2>
                                <p className="text-sm text-gray-500">{allLands.length} lands on blockchain</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fetchAllLands();
                                }}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoadingLands ? 'animate-spin' : ''}`} />
                            </button>
                            {showAllLands ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                    </button>

                    {showAllLands && (
                        <div className="p-6 pt-0">
                            {allLands.length === 0 ? (
                                <div className="text-center py-12 border-t border-gray-200 dark:border-gray-700 mt-4">
                                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                                    <p className="text-gray-500 dark:text-gray-400">No lands registered yet</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Register your first land using the form above</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6 mt-4">
                                    {allLands.map((land) => (
                                        <LandCard
                                            key={land.publicKey.toString()}
                                            id={land.account.id.toString()}
                                            location={land.account.location}
                                            area={land.account.area}
                                            owner={land.account.owner.toString()}
                                            isVerified={land.account.isVerified}
                                            transferCount={Number(land.account.transferCount)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
