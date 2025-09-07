import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Wallet } from 'lucide-react';
import { ethers } from 'ethers';
import { LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI } from '@/constants';

interface HistoryProps {
    provider: ethers.providers.Web3Provider | null;
}

const History = ({ provider }: HistoryProps) => {
    const [pastRounds, setPastRounds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        if (!provider) return;
        setIsLoading(true);
        try {
            const contract = new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI, provider);
            const currentRoundId = (await contract.currentRoundId()).toNumber();

            if (currentRoundId <= 1) { // No history if we are on round 1 or 0
                setPastRounds([]);
                return;
            }

            const roundsToFetch = [];
            // Fetch all rounds *before* the current active one.
            for (let i = currentRoundId - 1; i >= 1; i--) {
                roundsToFetch.push(contract.getRoundInfo(i));
            }

            const results = await Promise.all(roundsToFetch);
            
            const formattedRounds = results.map((round, index) => {
                const roundId = currentRoundId - 1 - index;
                return {
                    roundId: roundId,
                    winner: round.winner, // <-- USING THE REAL WINNER FROM THE CONTRACT
                    pot: round.pot,
                    playerCount: round.players.length
                };
            });

            setPastRounds(formattedRounds);

        } catch (error) {
            console.error("Failed to fetch lottery history:", error);
        } finally {
            setIsLoading(false);
        }
    }, [provider]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    if (isLoading) {
        return <p className="text-center text-muted-foreground">Loading lottery history...</p>;
    }

    if (pastRounds.length === 0) {
        return (
            <div className="text-center">
                <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-semibold">No Past Rounds</h3>
                <p className="mt-1 text-sm text-muted-foreground">The history of completed lottery rounds will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Lottery Round History</h2>
            {pastRounds.map((round) => (
                <Card key={round.roundId} className="bg-secondary border">
                    <CardHeader>
                        <CardTitle>Round #{round.roundId}</CardTitle>
                        <CardDescription className="font-mono text-xs pt-1">
                            Winner: <span className="text-primary">{`${round.winner.substring(0, 10)}...${round.winner.substring(round.winner.length - 4)}`}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wallet className="h-4 w-4" />
                            <span>Prize Pool:</span>
                            <span className="font-bold text-foreground">{ethers.utils.formatEther(round.pot)} BDAG</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Players:</span>
                            <span className="font-bold text-foreground">{round.playerCount}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default History;