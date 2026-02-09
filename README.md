# Nepal Land Registry System (Powered by Solana)
*Mero Maato, Mero Adhikar (My Land, My Right)*

## 🇳🇵 The Problem: Why We Need Change?
Land ownership in Nepal relies on the centuries-old "Dhadda" (paper ledger) system. While historic, this system is failing us in the digital age:

1.  **Decaying Records**: Paper documents (Lal Purja) rot, burn, or get lost over time. Once gone, your ownership proof is gone.
2.  **Fraud & Double Selling**: Corrupt actors can sell the same plot of land to multiple people because there is no instant, public way to verify true ownership.
3.  **Tampering**: A single bribe can lead to a page being torn out or names being overwritten in the official ledger.
4.  **Bureaucracy**: Transferring land takes days of running between offices, paying vague fees, and waiting for signatures.

## 🚀 The Solution: Blockchain Land Registry
We are moving land records from dusty shelves to the **Solana Blockchain**.

### Why Blockchain? (Not just a buzzword)
-   **Immutable (Unchangeable)**: Once a land record is on the blockchain, **no one**—not even a government official—can delete or alter it silently. History is permanent.
-   **Transparent**: Anyone with internet access can verify who owns a piece of land. No more secrets.
-   **Decentralized**: The data isn't stored in one room that can burn down. It's distributed across thousands of computers globally.

### Why Solana?
-   **Speed**: Transactions confirm in ~400 milliseconds. No waiting in line.
-   **Cost**: A transaction costs a fraction of a rupee ($0.00025). It's affordable for every Nepali citizen.
-   **Eco-Friendly**: Solana uses Proof-of-History, using less energy than a Google search.

---

## ✨ Key Features
1.  **Digital "Lal Purja"**: Your land ownership is tokenized and stored securely.
2.  **Instant Verification**: Type a Land ID and see its exact location, area, and owner history instantly.
3.  **Smart Transfers**: Buying land? The "Smart Contract" ensures money and ownership swap simultaneously. No trust needed.
4.  **Government Dashboard**: Officials can approve registrations digitally, creating an audit trail that cannot be faked.

---

## 📖 User Guide: For Absolute Beginners (Zero Knowledge)

### Step 1: Get Your Digital Wallet (The "New Pocket")
Think of this as your digital wallet where you keep your ID and keys.
1.  Download **Phantom Wallet** (App or Browser Extension).
2.  Create a new wallet. **WRITE DOWN THE 12 WORDS.** This is your secret key. If you lose it, you lose your account. Never share it.

### Step 2: Connect to the System
1.  Open our website.
2.  Click **"Select Wallet"** in the top right corner.
3.  Select "Phantom" and click "Connect". You are now logged in!

### Step 3: Verify a Property (Public)
*Scenario: You want to buy land in Kathmandu. The seller gives you Land ID #101.*
1.  Go to the **"Public Verification"** tab.
2.  Enter Land ID: `101`.
3.  Click **"Verify"**.
4.  The system will show you the **Owner's Address** and **Location**.
    *   *If the standard says "Unverified", do not buy it!*
    *   *If the Owner address doesn't match the seller's wallet, it's a scam!*

### Step 4: Registering Land (Government Officials Only)
1.  Go to the **"Government Dashboard"**.
2.  Log in with the authorized Government Wallet.
3.  Enter the Land Details:
    *   **Land ID**: Unique Plot Number.
    *   **Location**: e.g., "Baneshwor, Ward 10".
    *   **Area**: e.g., "4 Aana".
4.  Click **"Register"**.
5.  Approve the transaction in your wallet. The land is now permanently recorded on the blockchain!

---

## 🛠 For Developers
This project is built using:
-   **Solana (Anchor Framework)** for the backend logic.
-   **Next.js & React** for the frontend website.
-   **Devnet**: Currently running on Solana's test network (free to use).
