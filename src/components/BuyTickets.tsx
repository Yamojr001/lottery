import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI } from '@/constants';

interface BuyTicketsProps {
    provider: ethers.providers.Web3Provider | null;
    onTicketBought: () => void;
}

const BuyTickets = ({ provider, onTicketBought }: BuyTicketsProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [ticketPrice, setTicketPrice] = useState(ethers.BigNumber.from(0));
    const [currentRoundId, setCurrentRoundId] = useState(0);

    useEffect(() => {
        const fetchRoundData = async () => {
            if (!provider) return;
            try {
                const contract = new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI, provider);
                const roundId = await contract.currentRoundId();
                if (roundId.toNumber() === 0) return;

                setCurrentRoundId(roundId.toNumber());
                const roundInfo = await contract.getRoundInfo(roundId);
                setTicketPrice(roundInfo.ticketPrice);
            } catch (error) {
                console.error("Could not fetch ticket price:", error);
            }
        };
        fetchRoundData();
    }, [provider]);

    const handleBuyTicket = async () => {
        if (!provider || ticketPrice.isZero()) return;
        setIsLoading(true);
        toast({ title: "Processing Transaction...", description: "Please confirm in your wallet." });
        try {
            const signer = provider.getSigner();
            const contractInterface = new ethers.utils.Interface(LOTTERY_CONTRACT_ABI);
            const calldata = contractInterface.encodeFunctionData("buyTicket", [currentRoundId]);

            const tx = await signer.sendTransaction({
                to: LOTTERY_CONTRACT_ADDRESS,
                data: calldata,
                value: ticketPrice 
            });

            await tx.wait();
            toast({ title: "Success!", description: "You have purchased a lottery ticket." });
            onTicketBought(); // Trigger a refresh of the dashboard
        } catch (error: any) {
            const errorMessage = error.reason || "An error occurred. Do you have enough BDAG?";
            toast({ title: "Purchase Failed", description: errorMessage, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="fancy-card">
            <CardHeader>
                <CardTitle>Buy a Ticket</CardTitle>
                <CardDescription>
                    Your chance to win the grand prize! The ticket price is paid in native BDAG coin.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center text-2xl font-bold gradient-text">
                    Price: {ethers.utils.formatEther(ticketPrice)} BDAG
                </div>
                <Button onClick={handleBuyTicket} disabled={isLoading || ticketPrice.isZero()} className="w-full shadow-neon-green">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Processing..." : "Buy Ticket Now"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default BuyTickets;