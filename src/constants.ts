// src/constants.ts

// --- The final, live address of your lottery contract ---
export const LOTTERY_CONTRACT_ADDRESS = "0x72F9f25D4Aa334acAcCA8FD4F2258B207080E6fC";

// --- Your wallet address, which is the owner of the contract ---
export const OWNER_ADDRESS = "0x9261D7bf531633C3C13FBfc28240663dF8130024";

// --- The final ABI for your lottery contract ---
export const LOTTERY_CONTRACT_ABI = [
	{
		"inputs": [ { "internalType": "address", "name": "_feeRecipient", "type": "address" } ],
		"stateMutability": "nonpayable", "type": "constructor"
	},
	{ "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" },
	{ "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" },
	{ "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" },
	{ "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" },
	{ "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "endBlock", "type": "uint256" } ], "name": "RoundStarted", "type": "event" },
	{ "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "player", "type": "address" } ], "name": "TicketBought", "type": "event" },
	{ "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "winner", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "prize", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" } ], "name": "WinnerSelected", "type": "event" },
	{ "inputs": [ { "internalType": "uint256", "name": "roundId", "type": "uint256" } ], "name": "buyTicket", "outputs": [], "stateMutability": "payable", "type": "function" },
	{ "inputs": [], "name": "currentRoundId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "feeBps", "outputs": [ { "internalType": "uint16", "name": "", "type": "uint16" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "feeRecipient", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [ { "internalType": "uint256", "name": "roundId", "type": "uint256" } ], "name": "getRoundInfo", "outputs": [ { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "internalType": "uint256", "name": "endBlock", "type": "uint256" }, { "internalType": "uint256", "name": "pot", "type": "uint256" }, { "internalType": "address[]", "name": "players", "type": "address[]" }, { "internalType": "address", "name": "winner", "type": "address" }, { "internalType": "bool", "name": "active", "type": "bool" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
	{ "inputs": [ { "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "internalType": "string", "name": "secret", "type": "string" } ], "name": "revealAndPayout", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
	{ "inputs": [ { "internalType": "uint256", "name": "ticketPriceWei", "type": "uint256" }, { "internalType": "uint256", "name": "durationBlocks", "type": "uint256" }, { "internalType": "string", "name": "secret", "type": "string" } ], "name": "startRound", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
	{ "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];