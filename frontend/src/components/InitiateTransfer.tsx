"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import toast from "react-hot-toast";
import idl from "@/idl/land_registry.json";
import {
    ArrowRightLeft,
    Send,
    User,
    AlertCircle,
    Wallet,
} from "lucide-react";

const PROGRAM_ID = new PublicKey("CTVU4tR5QQ6g3rkY8rJLJptJGf9SwXzGjfoPkJtgZh8t");

interface InitiateTransferProps {
    landId: string;
    landTransferCount: number;
    owner: string;
    onSuccess: () => void;
}

export default function InitiateTransfer({ landId, landTransferCount, owner, onSuccess }: InitiateTransferProps) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [buyerAddress, setBuyerAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const isOwner = wallet.publicKey?.toString() === owner;

    // If not connected or not owner, show appropriate message
    if (!wallet.publicKey) {
        return (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Connect wallet to transfer this land
                    </p>
                </div>
                <WalletMultiButton />
            </div>
        );
    }

    if (!isOwner) {
        return (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Only the current owner can initiate a transfer
                    </p>
                </div>
            </div>
        );
    }

    const handleInitiate = async () => {
        if (!wallet.publicKey) return;

        if (!buyerAddress.trim()) {
            toast.error("Please enter buyer's wallet address");
            return;
        }

        // Validate buyer address
        try {
            new PublicKey(buyerAddress);
        } catch {
            toast.error("Invalid wallet address");
            return;
        }

        if (buyerAddress === wallet.publicKey.toString()) {
            toast.error("Cannot transfer to yourself");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Initiating transfer on blockchain...");

        try {
            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(idl as any, provider);

            const landBn = new BN(landId);
            const countBn = new BN(landTransferCount);

            const [landPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("land"), landBn.toArrayLike(Buffer, "le", 8)],
                PROGRAM_ID
            );

            const [transferPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("transfer"), landPda.toBuffer(), countBn.toArrayLike(Buffer, "le", 8)],
                PROGRAM_ID
            );

            const buyerPubkey = new PublicKey(buyerAddress);

            await program.methods
                .initiateTransfer(buyerPubkey)
                .accounts({
                    land: landPda,
                    transferRequest: transferPda,
                    owner: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                } as any)
                .rpc();

            toast.success("Transfer initiated! Waiting for buyer and government approval.", { id: loadingToast });
            setBuyerAddress("");
            setShowForm(false);
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("Transfer failed: " + (err as Error).message, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <ArrowRightLeft className="w-5 h-5" />
                    Initiate Transfer
                </button>
            ) : (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-4">
                        <ArrowRightLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                            Initiate Transfer
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <User className="w-4 h-4" />
                                Buyer's Wallet Address
                            </label>
                            <input
                                type="text"
                                value={buyerAddress}
                                onChange={(e) => setBuyerAddress(e.target.value)}
                                placeholder="Enter buyer's Solana public key"
                                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                    After initiating, the buyer must approve the transfer,
                                    and then the government will give final approval.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInitiate}
                                disabled={loading || !buyerAddress}
                                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Initiate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
