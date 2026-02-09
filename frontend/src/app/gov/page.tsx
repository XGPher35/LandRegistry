"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import idl from "@/idl/land_registry.json";

const PROGRAM_ID = new PublicKey("71SzaqeYfGgPp6X6ajhZzvUwDCd1R8GxYrkHchwrBoUp");

export default function GovernmentDashboard() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [landId, setLandId] = useState("");
    const [location, setLocation] = useState("");
    const [area, setArea] = useState("");
    const [status, setStatus] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [pendingTransfers, setPendingTransfers] = useState<any[]>([]);

    // Fetch balance whenever wallet changes or status updates (e.g. after airdrop)
    useEffect(() => {
        setMounted(true);
        if (!wallet.publicKey) {
            setBalance(null);
            return;
        }
        connection.getBalance(wallet.publicKey).then((bal) => setBalance(bal / web3.LAMPORTS_PER_SOL));
    }, [wallet.publicKey, connection, status]);

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

    const fetchPendingTransfers = async () => {
        if (!wallet.publicKey) return;
        try {
            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(idl as any, provider);

            // Fetch all transfer request accounts
            // Note: For MVP we fetch all. In prod, filter by status logic via memcmp if layout allows
            const allRequests = await (program.account as any).transferRequest.all();

            const pending = allRequests.filter((req: any) => {
                // Check if status is Pending (Enum variant)
                // The structure depends on how Anchor decodes enums. Usually it's { pending: {} }
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

            setStatus("Transfer Approved!");
            fetchPendingTransfers(); // Refresh list
        } catch (err) {
            console.error(err);
            setStatus("Approval Failed: " + (err as Error).message);
        }
    };

    // Load pending transfers on mount/wallet change
    useEffect(() => {
        fetchPendingTransfers();
    }, [wallet.publicKey]);


    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Government Dashboard</h1>
                <div className="flex items-center gap-4">
                    {balance !== null && <span className="text-sm font-mono">{balance.toFixed(2)} SOL</span>}
                    {mounted && <WalletMultiButton />}
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Registration Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
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

                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-2">Dev Tools</h3>
                        <button
                            onClick={async () => {
                                if (!wallet.publicKey) return;
                                try {
                                    setStatus("Requesting airdrop...");
                                    const signature = await connection.requestAirdrop(wallet.publicKey, 2 * web3.LAMPORTS_PER_SOL);
                                    await connection.confirmTransaction(signature, "confirmed");
                                    setStatus("Airdrop successful! 2 SOL added.");
                                } catch (err) {
                                    console.error(err);
                                    setStatus("Airdrop failed: " + (err as Error).message);
                                }
                            }}
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                        >
                            Request Airdrop (2 SOL)
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Use this if you get "insufficient funds" errors on Localnet.</p>
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Pending Transfers</h2>
                        <button onClick={fetchPendingTransfers} className="text-sm text-blue-500 hover:underline">Refresh</button>
                    </div>

                    {pendingTransfers.length === 0 ? (
                        <p className="text-gray-500">No pending transfers found.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingTransfers.map((req) => (
                                <div key={req.publicKey.toString()} className="border p-4 rounded dark:border-gray-700">
                                    <p><strong>Land ID:</strong> {req.account.landId.toString()}</p>
                                    <p><strong>Seller:</strong> <span className="font-mono text-xs">{req.account.seller.toString()}</span></p>
                                    <p><strong>Buyer:</strong> <span className="font-mono text-xs">{req.account.buyer.toString()}</span></p>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => approveTransfer(req.publicKey, req.account.landId)}
                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                            Approve Transfer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            );
}
