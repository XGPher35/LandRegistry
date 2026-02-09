"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Helper to get IDL (Ideally fetch from file or import types)
// For now, we'll use a simplified ABI or copy-paste relevant parts if needed.
// In a real app, importing IDs from target/types/land_registry.ts is best.
import idl from "@/idl/land_registry.json";

const PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

export default function GovernmentDashboard() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [landId, setLandId] = useState("");
    const [location, setLocation] = useState("");
    const [area, setArea] = useState("");
    const [status, setStatus] = useState("");

    const registerLand = async () => {
        if (!wallet.publicKey) {
            setStatus("Connect wallet first!");
            return;
        }

        try {
            // Cast to any to bypass strict type checking for MVP
            const provider = new AnchorProvider(connection, wallet as any, {});
            const prog = new Program(idl as any, provider);

            const id = new BN(landId);
            const [landPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("land"), id.toArrayLike(Buffer, "le", 8)],
                PROGRAM_ID
            );

            setStatus("Registering...");

            await prog.methods
                .registerLand(id, location, area)
                .accounts({
                    land: landPda,
                    owner: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            setStatus("Land Registered Successfully! PDA: " + landPda.toString());
        } catch (err) {
            console.error(err);
            setStatus("Registration Failed: " + (err as Error).message);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Government Dashboard</h1>
                <WalletMultiButton />
            </header>

            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Register New Land</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Land ID (Numeric)</label>
                        <input
                            type="number"
                            value={landId}
                            onChange={(e) => setLandId(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Area (sq ft)</label>
                        <input
                            type="text"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <button
                        onClick={registerLand}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
                    >
                        Register Land
                    </button>

                    {status && <p className="mt-4 text-sm break-words">{status}</p>}
                </div>
            </div>
        </div>
    );
}
