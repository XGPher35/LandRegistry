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
