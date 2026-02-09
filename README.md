<<<<<<< HEAD
# Nepal Land Registry 🏛️

A secure, immutable, and transparent land ownership system built on **Solana** using the **Anchor** framework.

## Overview

This project provides a blockchain-based land registry system for Nepal, enabling:
- **Government** to register verified land records on-chain
- **Public** to verify land ownership instantly
- **Land Owners** to initiate secure ownership transfers
- **Multi-party approval** for transfers (buyer + government)

## Prerequisites

Ensure you have the following installed:
- **Rust** (1.70+)
- **Solana CLI** (1.18+)
- **Anchor CLI** (0.30.1+)
- **Node.js** (18+)
- **npm** or **yarn**

## Quick Start Guide

### Wallet Setup (Important!)

1.  Open your **Phantom** or **Solflare** wallet extension.
2.  Go to **Settings** -> **Developer Settings**.
3.  Turn **Testnet Mode** ON.
4.  Change the network to **Localhost** (`127.0.0.1:8899`).
5.  If you have connection issues, go to **Trusted Apps** and **Revoke** access for `localhost:3000`, then reconnect.

Follow these steps to run the project locally.

### 1. Project Setup

```bash
# Clone the repository
git clone <repo-url>
cd LandRegistry

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Start Local Blockchain

Open a new terminal and run:

```bash
solana-test-validator --reset
```

> **Note:** Keep this terminal running.
> **Warning:** If you stop and restart this command, the blockchain state is wiped (balance = 0, programs deleted). You MUST run `anchor deploy` again!

### 3. Build & Deploy Smart Contract

In the main project directory:

```bash
# 1. Build the program
anchor build

# 2. Sync program keys (updates declaring_id with valid keypair)
anchor keys sync

# 3. Rebuild to bake in the synced key
anchor build

# 4. Fund your deployment wallet (localnet)
solana airdrop 5

# 5. Deploy the program
anchor deploy
```

### 4. Configure Frontend

After deployment, update the frontend configuration to match your local deployment.

```bash
# Copy the generated IDL to the frontend
cp target/idl/land_registry.json frontend/src/idl/
```

**Important:**
1.  Copy the **Program ID** output from the `anchor deploy` command.
2.  Update the `PROGRAM_ID` constant in:
    -   `frontend/src/app/gov/page.tsx`
    -   `frontend/src/app/public/page.tsx`

### 5. Run the Application

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  Home Page     │  Gov Dashboard    │  Public Verification       │
│  (/)           │  (/gov)           │  (/public)                 │
└────────────────┴──────────────────┴─────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Solana Blockchain (Localnet)                 │
├─────────────────────────────────────────────────────────────────┤
│  Land Registry Program (Anchor)                                 │
│  ├── registerLand()      - Register new land                   │
│  ├── initiateTransfer()  - Start ownership transfer            │
│  └── approveTransfer()   - Approve transfer (buyer/gov)        │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Blockchain | Solana |
| Smart Contract | Anchor (Rust) |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4 |
| Wallet | Phantom, Solflare |

## Smart Contract Instructions

| Instruction | Description |
|-------------|-------------|
| `registerLand(land_id, location, area)` | Register new land (government only) |
| `initiateTransfer(buyer)` | Current owner initiates transfer to buyer |
| `approveTransfer()` | Buyer or government approves pending transfer |

## License

MIT
=======
# Nepal Land Registry System
*Mero Maato, Mero Adhikar (My Land, My Right)*

## 🇳🇵 The Problem

Land ownership in Nepal relies on the centuries-old "Dhadda" (paper ledger) system. This creates serious problems:

1.  **Lost Records**: Paper documents (Lal Purja) deteriorate, burn in fires, or simply go missing. When they're gone, proving ownership becomes nearly impossible.
2.  **Fraud & Double Selling**: The same plot gets sold to multiple buyers because there's no way to instantly verify true ownership. Corrupt officials enable this by altering records.
3.  **Easy Tampering**: A bribe can result in pages torn from ledgers or names changed in official books.
4.  **Bureaucratic Hell**: Transferring land ownership takes days or weeks of running between offices, with unclear fees and endless paperwork.

## 🚀 The Solution

We're putting land records on the **Solana Blockchain** - making them permanent, transparent, and impossible to forge.

### Why Blockchain?

-   **Immutable**: Once recorded, no one can secretly delete or alter ownership records. Not even government officials.
-   **Transparent**: Anyone can verify who owns a piece of land instantly. No closed-door deals.
-   **Decentralized**: Records aren't in one office that can burn down. They're distributed across thousands of nodes globally.

### Why Solana?

-   **Fast**: Transactions confirm in under a second
-   **Cheap**: Costs fractions of a rupee per transaction ($0.00025)
-   **Scalable**: Can handle Nepal's entire land registry without breaking a sweat

---

## ✨ Features

### 1. Secure Land Registration
- Only authorized government wallets can register new land
- Each plot gets a unique ID tied to owner's wallet address
- Duplicate registrations are automatically prevented

### 2. Public Verification Portal
- Anyone can search a Land ID and see current owner, location, and area
- Complete transfer history visible on-chain
- Verify ownership before purchasing - no more fraud

### 3. Smart Contract Transfers
- Land owners initiate transfers to buyer's wallet
- Government approves legitimate transactions
- Ownership changes automatically once approved
- Full audit trail of every transaction

### 4. Government Dashboard
- View all registered lands
- Approve or reject pending transfer requests
- Search and verify ownership records
- Analytics on registration and transfer activity

### 5. Transfer History Tracking
- Every ownership change is permanently logged
- Blockchain events show: who, when, and to whom
- Catch suspicious patterns (rapid flipping, fraud attempts)

### 6. Document Storage (Phase 2)
- IPFS integration for storing scanned Lal Purja and legal documents
- Only cryptographic hashes stored on-chain (keeps costs low)
- Documents can't be tampered with once uploaded

---

## 🔧 Technical Stack

- **Blockchain**: Solana (Anchor Framework)
- **Smart Contracts**: Rust
- **Frontend**: Next.js + React
- **Network**: Devnet (testing), upgradeable for Mainnet
- **Wallet**: Phantom (browser extension or mobile app)

---

## 🚀 Getting Started

### Prerequisites
- Phantom Wallet installed
- Some devnet SOL for testing (get free from Solana faucet)

### Installation
```bash
# Clone the repo
git clone [your-repo-url]

# Install dependencies
npm install

  # Start the app
  npm run dev
  ```

### Quick Demo Flow

1. **Connect Wallet**: Click "Select Wallet" and connect Phantom
2. **Verify Land**: Go to Public Verification, enter any Land ID (try 101, 102, 103)
3. **Government Actions**: Switch to Government Dashboard (requires authorized wallet)
4. **Register Land**: Enter land details and submit transaction
5. **Transfer Land**: As an owner, initiate transfer to another wallet
6. **Approve Transfer**: Government reviews and approves the transfer
7. **Check History**: View complete ownership timeline for any land

---

## 🎯 Why This Matters

**Current System**: A corrupt clerk can make your land disappear from records overnight.

**Our System**: Your ownership is cryptographically secured. To steal your land, someone would need to:
- Hack your Phantom wallet (requires your 12-word secret phrase)
- Forge your digital signature (mathematically impossible)
- Compromise the entire Solana network (thousands of validators globally)

Even bribing officials won't work - they can't change blockchain records.

---

## 📈 Roadmap

**Phase 1 (Current)**: ✅ Core land registry and transfer system  
**Phase 2**: Document storage via IPFS  
**Phase 3**: Mobile app for rural areas  
**Phase 4**: SMS notifications for transfers  
**Phase 5**: Integration with Nepal government systems  

---

## 👥 Team

Arjit Chand
Adarsha Pant 
Swarnim Bajracharya
Pranaya Shrestha
---
<<<<<<< HEAD

## 📄 License

[Your license]
>>>>>>> 2ab48778a51a167f43ae19a327454f5494c590fc
=======
>>>>>>> 130b9bdaa73fa1ac3fda6b09f636581651ac4781
