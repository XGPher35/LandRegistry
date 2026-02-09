"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";

import idl from "@/idl/land_registry.json";

const PROGRAM_ID = new PublicKey("71SzaqeYfGgPp6X6ajhZzvUwDCd1R8GxYrkHchwrBoUp");

export default function PublicPortal() {
    const { connection } = useConnection();

    const [searchId, setSearchId] = useState("");
    const [landData, setLandData] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const verifyLand = async () => {
        setLoading(true);
        setError("");
        setLandData(null);

        try {
            // Read-only provider (no wallet needed for viewing)
            const provider = new AnchorProvider(connection, {} as any, {});
            // Cast to any to handle type mismatches without full IDL types
            const program = new Program(idl as any, provider);

            const id = new BN(searchId);
            const [landPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("land"), id.toArrayLike(Buffer, "le", 8)],
                PROGRAM_ID
            );

            // Explicitly cast account namespace to accessed dynamic property
            const account = await (program.account as any).land.fetch(landPda);
            setLandData(account);

        } catch (err) {
            console.error(err);
            setError("Land not found or invalid ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Public Verification Portal</h1>
                <p className="text-gray-500">Verify land ownership and details instantly.</p>
            </header>

            <div className="max-w-xl mx-auto space-y-8">
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Enter Land ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1 p-3 border rounded text-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button
                        onClick={verifyLand}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-lg disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </div>

                {error && <div className="p-4 bg-red-100 text-red-700 rounded border border-red-300">{error}</div>}

                {landData && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold mb-4 text-green-600">✔ Verified Land Record</h3>
                        <div className="grid grid-cols-2 gap-4 text-lg">
                            <div className="text-gray-500">Land ID:</div>
                            <div className="font-mono">{landData.id.toString()}</div>

                            <div className="text-gray-500">Location:</div>
                            <div>{landData.location}</div>

                            <div className="text-gray-500">Area:</div>
                            <div>{landData.area} sq ft</div>

                            <div className="text-gray-500">Current Owner:</div>
                            <div className="font-mono text-xs break-all">{landData.owner.toString()}</div>

                            <div className="text-gray-500">Transfers:</div>
                            <div>{landData.transferCount.toString()}</div>

                            <div className="text-gray-500">Status:</div>
                            <div>{landData.isVerified ? "Gov Verified" : "Unverified"}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
