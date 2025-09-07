# BlockDAG Lottery

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple)](https://vitejs.dev/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-blue)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-cyan)](https://tailwindcss.com/)

## A Provably Fair, Real-Time Lottery on the BlockDAG Network

Unlock On-Chain Transparency in Gaming

Today, most online lotteries are a "black box." You buy a ticket and trust that the operator is being honest. The BlockDAG Lottery solves this by bringing the entire process onto the blockchain. Every ticket purchase, every prize pool update, and the final winner selection is a public, verifiable transaction.

It's a gaming experience built on cryptographic truth, not trust. Your assets are managed by an immutable smart contract, and the winner is chosen by a provably fair algorithm that even the creators of the lottery cannot influence.

This project was built as a complete, production-ready MVP for the BlockDAG Hackathon. It demonstrates how to build a polished, live, and user-friendly decentralized application from the ground up on a modern EVM network.

<img width="700" alt="BlockDAG Lottery Dashboard" src="https://YOUR_IMAGE_HOSTING_URL/dashboard.png" />
*<p align="center">The Live Dashboard: Real-time prize pool, player count, and a dynamic countdown.</p>*

<img width="700" alt="BlockDAG Lottery Admin Panel" src="https://YOUR_IMAGE_HOSTING_URL/admin-panel.png" />
*<p align="center">The Admin Panel: Secure, owner-only functions to manage the lottery rounds.</p>*

## How It Actually Works

The BlockDAG Lottery uses a classic and secure **Commit-Reveal Scheme** to ensure provably fair randomness without relying on any external, off-chain services.

When an admin starts a new round, they don't pick a winning number. Instead, they provide a secret string (e.g., `"my-secret-word-123"`). The smart contract hashes this secret using `keccak256` and stores only the hash—the "commit." At this point, the outcome is sealed, and no one, not even the admin, can manipulate it.

Users buy tickets by sending BDAG coins directly to the smart contract, which transparently updates the prize pool. Once the round's duration (measured in blocks) is over, the admin reveals the original secret. The contract verifies that the hash of the revealed secret matches the one it stored. It then combines this secret with the hash of the `endBlock`—a value that was unpredictable when the round started—to generate a verifiably random number and select a winner from the array of players.

The biggest challenge during development was the dreaded `network does not support ENS` error. This cryptic message became my nemesis, appearing every time a transaction was sent. It turns out that the `ethers.js` library, built for Ethereum, performs pre-flight checks that are incompatible with new networks like BlockDAG. The solution was to bypass the high-level contract functions and instead manually build and send the raw transaction data. This gave us full control and made the app robust on any EVM network.

## The Technology Stack

The frontend is built with **React + Vite + TypeScript**, the modern standard for fast, type-safe, and efficient web applications. Vite provides a lightning-fast development experience with instant hot-reloading, and TypeScript ensures our code is robust and less prone to bugs.

For the user interface, **Tailwind CSS + shadcn/ui** were chosen for their professional, clean aesthetic and developer-friendly approach. This allowed for the rapid creation of beautiful, accessible components like cards, tabs, and toast notifications that give the app a polished, production-ready feel.

Blockchain interaction is handled by **ethers.js**, the most trusted library for connecting to EVM-compatible networks. It allows the frontend to communicate directly with our smart contract through the user's **MetaMask** wallet, reading live data and sending transactions securely.

The smart contract is written in **Solidity** and builds upon the battle-tested **OpenZeppelin** libraries for security features like `Ownable` (to ensure only the admin can manage rounds) and `ReentrancyGuard` (to prevent common attack vectors).

## Getting Started

Setting up the BlockDAG Lottery is straightforward. Follow these steps to get the project running locally.

**1. Prerequisites**
*   Node.js and npm installed.
*   MetaMask browser extension installed.
*   Get some `tBDAG` from the official BlockDAG Testnet Faucet.

**2. Installation**
```bash
# Clone the repository
git clone https://github.com/your-username/blockdag-lotto-builder.git
cd blockdag-lotto-builder

# Install all necessary dependencies
npm install
```

**3. Smart Contract Deployment**
*   The contract is in the file `BlockDagNativeLottery.sol`.
*   Copy the code and deploy it using the official **BlockDAG IDE**.
*   When deploying, provide your wallet address as the `_feeRecipient`.

**4. Frontend Configuration**
*   Navigate to the `src/constants.ts` file.
*   Replace the placeholder `LOTTERY_CONTRACT_ADDRESS` with your newly deployed contract address.
*   Update the `OWNER_ADDRESS` with the wallet address you used for deployment.
*   Paste the final ABI from your contract compilation into the `LOTTERY_CONTRACT_ABI` variable.

**5. Run the Application**
```bash
npm run dev
```
Open your browser to `http://localhost:5173` to see the application live.

## What Makes This Different

The BlockDAG Lottery isn't just a proof-of-concept; it's a demonstration of a complete, dynamic user experience on a new blockchain.

*   **Truly Live Data:** The dashboard automatically polls the blockchain every 10 seconds. When a new player buys a ticket, the prize pool and participant list update in real-time for every user watching.
*   **Real-Time Countdown:** The timer isn't just a simple JavaScript clock. It actively queries the BlockDAG network for the current block number and calculates the estimated time remaining, providing an accurate and dynamic countdown.
*   **Hackathon-Ready:** The entire project, from the simple one-click ticket purchase to the fast-paced, admin-configurable round times, is designed for an impressive live demonstration.
*   **User-Centric Design:** The interface is clean, intuitive, and provides constant feedback through loading states and toast notifications, building user trust.

## The Road Ahead

This project is a solid foundation, and the architecture is built to scale. The mainnet launch is the next logical step after a thorough security audit.

Future features are already being planned:
*   **Progressive Jackpots:** Rounds where no tickets are sold could have their prize pools roll over to the next round.
*   **New Game Modes:** Different game types, like a 5-number draw, could be implemented as new contracts.
*   **NFT Tickets:** Issuing tickets as unique NFTs that could become collectibles after a round ends.

This is open source because that's the spirit of Web3. Found a bug or have an idea for a new feature? Pull requests are always welcome. The areas where help is most appreciated include smart contract gas optimizations and documentation.

Building this project was a journey from a simple idea to a fully functional dApp. Every bug, every "network does not support ENS" error, and every late-night debugging session led to a more robust and polished product. This is my attempt at building a fun, fair, and transparent gaming application for the BlockDAG ecosystem.

**Built with ❤️ and a lot of debugging.**

---

**Application**: `https://YOUR_VERCEL_OR_NETLIFY_URL` | **GitHub**: `https://github.com/your-username/blockdag-lotto-builder`