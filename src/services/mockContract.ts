// src/services/mockContract.ts
import { ethers } from "ethers";

// --- FAKE BLOCKCHAIN DATA ---
let mockData = {
  currentRound: {
    roundId: 2,
    ticketPrice: ethers.utils.parseEther("0.01"),
    endTime: new Date().getTime() + (60 * 60 * 1000), // Ends in 1 hour
    pot: ethers.utils.parseEther("0.07"),
    players: ["", "", "", "", "", "", ""], // 7 players
    winner: null as string | null,
    paid: false,
    exists: true,
  },
  history: [
    { roundId: 1, winner: "0xAbCd...1234", pot: ethers.utils.parseEther("0.049"), players: { length: 5 }, paid: true },
  ],
};

// Helper to simulate blockchain delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- EXPORTED FUNCTIONS ---

export const getMockRoundData = async () => {
  await sleep(500); // Simulate network latency
  return mockData.currentRound;
};

export const getMockAggregateStats = async () => {
    await sleep(600);
    const totalRounds = mockData.history.length;
    const totalPrizes = mockData.history.reduce((acc, round) => acc.add(round.pot), ethers.BigNumber.from(0));
    const totalPlayers = mockData.history.reduce((acc, round) => acc + round.players.length, 0);
    return { totalRounds, totalPrizes, totalPlayers };
};

// --- THIS IS THE MISSING FUNCTION ---
export const mockBuyTickets = async (count: number) => {
  console.log(`Mocking buying ${count} tickets`);
  await sleep(1500);
  const round = mockData.currentRound;

  if (!round.exists) {
    throw new Error("Mock Error: No active round to buy tickets for!");
  }
  
  for (let i = 0; i < count; i++) {
    round.players.push(`0xNewPlayer...`);
  }
  round.pot = round.pot.add(round.ticketPrice.mul(count));
  
  console.log("Tickets bought. New pot:", round.pot);
  return { success: true, newPot: round.pot, newPlayerCount: round.players.length };
};

export const mockStartRound = async (ticketPrice: string, duration: number) => {
  console.log("Mocking startRound with:", { ticketPrice, duration });
  await sleep(2000);

  if (Number(ticketPrice) <= 0) {
    throw new Error("Mock Error: Ticket price must be > 0");
  }

  if (mockData.currentRound.exists) {
    mockData.history.unshift({ ...mockData.currentRound, winner: "0xOldWinner...1234", paid: true });
  }

  mockData.currentRound = {
    roundId: mockData.currentRound.roundId + 1,
    ticketPrice: ethers.utils.parseEther(ticketPrice),
    endTime: new Date().getTime() + (duration * 1000),
    pot: ethers.utils.parseEther("0"),
    players: [],
    winner: null,
    paid: false,
    exists: true,
  };

  console.log("New round started:", mockData.currentRound);
  return { success: true, round: mockData.currentRound };
};

export const mockRequestRandomness = async (roundId: number) => {
  console.log("Mocking requestRandomness for round:", roundId);
  await sleep(3000);

  const round = mockData.currentRound;
  if (round.roundId !== roundId) {
    throw new Error("Mock Error: Invalid round ID");
  }
  if (new Date().getTime() < round.endTime) {
    throw new Error("Mock Error: Round has not ended yet");
  }
  
  if (round.players.length === 0) {
      round.winner = "0x0000000000000000000000000000000000000000";
  } else {
      const winnerIndex = Math.floor(Math.random() * round.players.length);
      round.winner = `0xMockPlayer...${winnerIndex}`;
  }
  
  round.paid = true;

  console.log("Winner selected:", round.winner);
  return { success: true, winner: round.winner };
};