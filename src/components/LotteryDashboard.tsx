import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatCard from './StatCard';
import { Ticket, Users, Wallet, RefreshCw, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI } from '@/constants';

interface LotteryDashboardProps {
    provider: ethers.providers.Web3Provider | null;
    refreshKey: number;
}

const LotteryDashboard = ({ provider, refreshKey }: LotteryDashboardProps) => {
    const [roundData, setRoundData] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState("Calculating...");
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchRoundData = useCallback(async (isManualRefresh = false) => {
        if (!window.ethereum) return;
        if (isManualRefresh) setIsRefreshing(true);

        try {
            // THE FIX: Create a brand new provider for every fetch.
            // This is the most aggressive way to bypass a laggy or cached RPC node.
            const freshProvider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI, freshProvider);
            const roundId = await contract.currentRoundId();

            if (roundId.toNumber() === 0) {
                setRoundData(null);
                return;
            }

            const data = await contract.getRoundInfo(roundId);
            
            // Create a completely new object to guarantee a state update
            const newRoundData = {
                ticketPrice: data.ticketPrice,
                endBlock: data.endBlock.toNumber(),
                pot: data.pot,
                players: data.players,
                isActive: data.active,
                roundId: roundId.toNumber(),
            };
            setRoundData(newRoundData);

        } catch (error) {
            console.error("Could not fetch round data:", error);
            setRoundData(null);
        } finally {
            if (isManualRefresh) setIsRefreshing(false);
        }
    }, []); // Removed provider from dependencies as we create a new one each time

    useEffect(() => {
        setIsLoading(true);
        fetchRoundData().finally(() => setIsLoading(false));
        const interval = setInterval(fetchRoundData, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [refreshKey, fetchRoundData]);

    useEffect(() => {
        if (!roundData || !provider) return;
        const timer = setInterval(async () => {
            if (!roundData.isActive) {
                setTimeLeft("Round Ended");
                clearInterval(timer);
                return;
            }
            try {
                const currentBlock = await provider.getBlockNumber();
                const blocksRemaining = roundData.endBlock - currentBlock;

                if (blocksRemaining <= 0) {
                    setTimeLeft("Round Can Be Finalized");
                    clearInterval(timer);
                    return;
                }
                
                const secondsRemaining = blocksRemaining * 3;
                const hours = Math.floor(secondsRemaining / 3600);
                const minutes = Math.floor((secondsRemaining % 3600) / 60);
                const seconds = secondsRemaining % 60;
                
                setTimeLeft(`${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s remaining (est.)`);
            } catch (error) {
                setTimeLeft("Calculating...");
            }
        }, 3000);
        return () => clearInterval(timer);
    }, [roundData, provider]);


    if (isLoading) return <p className="text-center text-muted-foreground">Connecting to the lottery contract...</p>;
    if (!roundData) return <p className="text-center text-muted-foreground">No active lottery round. The admin needs to start a new one.</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Current Lottery Round #{roundData.roundId}</h2>
                    <p className="text-muted-foreground font-mono">{timeLeft}</p>
                </div>
                <div className="flex items-center gap-2">
                    {roundData.isActive ? <Badge variant="outline" className="text-primary border-primary">Live</Badge> : <Badge variant="destructive">Ended</Badge>}
                    <Button variant="outline" size="icon" onClick={() => fetchRoundData(true)} disabled={isRefreshing}>
                        {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Prize Pool" value={`${ethers.utils.formatEther(roundData.pot)} BDAG`} icon={Wallet} />
                <StatCard title="Ticket Price" value={`${ethers.utils.formatEther(roundData.ticketPrice)} BDAG`} icon={Ticket} />
                <StatCard title="Players" value={roundData.players.length} icon={Users} />
            </div>
            <Card className="bg-secondary border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Participants ({roundData.players.length})</CardTitle>
                    <CardDescription>{roundData.players.length > 0 ? "Latest players to join the round." : "Be the first to join!"}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {roundData.players.slice().reverse().map((player: string, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-background rounded-md font-mono text-sm">
                                <span>{`${player.substring(0, 6)}...${player.substring(player.length - 4)}`}</span>
                                <span>Ticket #{roundData.players.length - index}</span>
                            </div>
                        ))}
                         {roundData.players.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">The stage is set...</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LotteryDashboard;