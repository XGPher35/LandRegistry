# Nepal Land Registry 🏛️

**Mero Maato, Mero Adhikar** (My Land, My Right)

A secure, immutable, and transparent land ownership system built on **Solana** using the **Anchor** framework.

---

## 🇳🇵 The Problem

Land ownership in Nepal relies on the centuries-old "Dhadda" (paper ledger) system. This creates serious problems:

1. **Lost Records**: Paper documents (Lal Purja) deteriorate, burn in fires, or simply go missing
2. **Fraud & Double Selling**: The same plot gets sold to multiple buyers due to no instant verification
3. **Easy Tampering**: Bribes can alter official records
4. **Bureaucratic Hell**: Transferring ownership takes weeks of running between offices

## 🚀 Our Solution

We're putting land records on the **Solana Blockchain** - making them permanent, transparent, and impossible to forge.

### Why Blockchain?
- **Immutable**: Once recorded, no one can secretly alter ownership records
- **Transparent**: Anyone can verify land ownership instantly
- **Decentralized**: Records distributed across thousands of nodes globally

### Why Solana?
- **Fast**: Transactions confirm in under a second
- **Cheap**: Costs fractions of a rupee per transaction ($0.00025)
- **Scalable**: Can handle Nepal's entire land registry

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Registration** | Only government wallets can register land |
| 🔍 **Public Verification** | Anyone can verify ownership instantly |
| 🔄 **Smart Transfers** | Multi-party approval (buyer + government) |
| 📊 **Dashboard Analytics** | Statistics and all lands view |
| 👤 **Owner Portal** | Manage your holdings and approve transfers |
| 📜 **Transfer History** | Complete audit trail on blockchain |
| 📱 **QR Codes** | Generate shareable verification links |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Blockchain | Solana |
| Smart Contract | Anchor (Rust) |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4 |
| Wallet | Phantom, Solflare |

---

## 🚀 Quick Start

### Prerequisites
- **Rust** (1.70+)
- **Solana CLI** (1.18+)
- **Anchor CLI** (0.30.1+)
- **Node.js** (18+)
- **Phantom Wallet** extension

### Wallet Setup
1. Open your Phantom wallet
2. Go to **Settings** → **Developer Settings**
3. Turn **Testnet Mode** ON
4. Change network to **Localhost** (`127.0.0.1:8899`)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd LandRegistry

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Start Local Blockchain

```bash
# In a new terminal - keep this running
solana-test-validator --reset
```

### Build & Deploy Smart Contract

```bash
# Build the program
anchor build

# Sync program keys
anchor keys sync

# Rebuild with synced key
anchor build

# Fund your wallet
solana airdrop 5

# Deploy
anchor deploy
```

### Configure Frontend

```bash
# Copy IDL to frontend
cp target/idl/land_registry.json frontend/src/idl/

# Update PROGRAM_ID in frontend files with the deployed address
```

### Run the Application

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
LandRegistry/
├── programs/land-registry/     # Solana smart contract (Rust)
│   └── src/lib.rs             # Main program logic
├── frontend/                   # Next.js application
│   └── src/
│       ├── app/               # Pages
│       │   ├── page.tsx       # Homepage
│       │   ├── gov/           # Government Dashboard
│       │   ├── public/        # Public Verification
│       │   └── owner/         # Owner Portal
│       ├── components/        # React components
│       └── idl/               # Program IDL
└── target/                    # Build artifacts
```

---

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  Home Page  │  Gov Dashboard  │  Public Portal  │  Owner Portal │
└─────────────┴─────────────────┴─────────────────┴───────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Solana Blockchain (Localnet)                 │
├─────────────────────────────────────────────────────────────────┤
│  Land Registry Program (Anchor)                                 │
│  ├── registerLand()      - Register new land (gov only)        │
│  ├── initiateTransfer()  - Start ownership transfer            │
│  └── approveTransfer()   - Approve transfer (buyer/gov)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 Roadmap

- ✅ **Phase 1**: Core land registry and transfer system
- 🔲 **Phase 2**: Document storage via IPFS
- 🔲 **Phase 3**: Mobile app for rural areas
- 🔲 **Phase 4**: SMS notifications for transfers
- 🔲 **Phase 5**: Integration with Nepal government systems

---

## 🔒 Security

**Current System**: A corrupt clerk can make your land disappear overnight.

**Our System**: Your ownership is cryptographically secured. To steal your land, someone would need to:
- Hack your Phantom wallet (requires your 12-word secret phrase)
- Forge your digital signature (mathematically impossible)
- Compromise the entire Solana network (thousands of validators)

Even bribing officials won't work - they cannot change blockchain records.

---

## 📄 License

MIT

---

## 👥 Team

Built with ❤️ for the Nepal Land Registry Hackathon
