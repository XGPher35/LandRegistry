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

[Your team names/info here]

---

## 📄 License

[Your license]