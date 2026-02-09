"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "@/idl/land_registry.json";

const PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

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
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const isOwner = wallet.publicKey?.toString() === owner;

    if (!isOwner) return null;

    const handleInitiate = async () => {
        if (!wallet.publicKey) return;
        setLoading(true);
        setStatus("Initiating transfer...");

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

            setStatus("Transfer request created! Waiting for government approval.");
            onSuccess();
        } catch (err) {
            console.error(err);
            setStatus("Error: " + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">Initiate Transfer</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Buyer Wallet Address</label>
                    <input
                        type="text"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder="Enter buyer's public key"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                    />
                </div>
                <button
                    onClick={handleInitiate}
                    disabled={loading || !buyerAddress}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Initiate Transfer"}
                </button>
                {status && <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{status}</p>}
            </div>
        </div>
    );
}
