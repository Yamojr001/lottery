import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI } from '@/constants';

interface AdminPanelProps {
    provider: ethers.providers.Web3Provider | null;
}

const AdminPanel = ({ provider }: AdminPanelProps) => {
    const { toast } = useToast();
    const [isLoadingStart, setIsLoadingStart] = useState(false);
    const [isLoadingReveal, setIsLoadingReveal] = useState(false);

    // State for the "Start Round" form
    const [ticketPrice, setTicketPrice] = useState("0.01");
    const [duration, setDuration] = useState("100");
    const [startSecret, setStartSecret] = useState("");

    // State for the "Reveal Winner" form
    const [revealSecret, setRevealSecret] = useState("");

    const handleGenerateSecret = () => {
        const randomSecret = "secret-" + Math.random().toString(36).substring(2, 15);
        setStartSecret(randomSecret);
        toast({ title: "Secret Generated!", description: "Save this for the reveal step." });
    };

    const handleStartRound = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider) {
            toast({ title: "Wallet Not Connected", description: "Please ensure your wallet is connected.", variant: "destructive" });
            return;
        }
        if (!ticketPrice || !duration || !startSecret) {
            toast({ title: "Missing Fields", description: "Please fill out all fields to start a round.", variant: "destructive"});
            return;
        }
        setIsLoadingStart(true);
        toast({ title: "Submitting Transaction...", description: "Please confirm in your wallet." });

        try {
            const signer = provider.getSigner();
            
            // THE FIX: Manually build and send the transaction to bypass ENS check
            const contractInterface = new ethers.utils.Interface(LOTTERY_CONTRACT_ABI);
            const priceInWei = ethers.utils.parseEther(ticketPrice);
            const calldata = contractInterface.encodeFunctionData("startRound", [priceInWei, duration, startSecret]);

            const tx = await signer.sendTransaction({
                to: LOTTERY_CONTRACT_ADDRESS,
                data: calldata,
            });

            await tx.wait(); // Wait for the transaction to be mined

            toast({ title: "Success!", description: "A new lottery round has been started."});
            // Clear the form on success
            setTicketPrice("0.01");
            setDuration("100");
            setStartSecret("");
        } catch (error: any) {
            const errorMessage = error.reason || "An unexpected error occurred.";
            toast({ title: "Error Starting Round", description: errorMessage, variant: "destructive" });
        } finally {
            setIsLoadingStart(false);
        }
    };
  
    const handleRevealWinner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider) {
            toast({ title: "Wallet Not Connected", description: "Please ensure your wallet is connected.", variant: "destructive" });
            return;
        }
        if (!revealSecret) {
            toast({ title: "Missing Secret", description: "You must provide the secret to reveal the winner.", variant: "destructive"});
            return;
        }
        setIsLoadingReveal(true);
        toast({ title: "Revealing Winner...", description: "Please confirm the transaction in your wallet." });

        try {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI, provider); // Use provider for read-only call
            const currentRoundId = await contract.currentRoundId();

            // THE FIX: Manually build and send the transaction
            const contractInterface = new ethers.utils.Interface(LOTTERY_CONTRACT_ABI);
            const calldata = contractInterface.encodeFunctionData("revealAndPayout", [currentRoundId, revealSecret]);
            
            const tx = await signer.sendTransaction({
                to: LOTTERY_CONTRACT_ADDRESS,
                data: calldata,
            });

            await tx.wait();

            toast({ title: "Success!", description: "Winner has been selected and paid out."});
            setRevealSecret("");
        } catch (error: any) {
            const errorMessage = error.reason || "An unexpected error occurred.";
            toast({ title: "Error Revealing Winner", description: errorMessage, variant: "destructive" });
        } finally {
            setIsLoadingReveal(false);
        }
    }
    
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/>Admin Panel</h2>
                    <p className="text-muted-foreground">Contract owner functions for managing lottery rounds</p>
                </div>
                <Badge variant="outline" className="text-primary border-primary">Owner Access</Badge>
            </div>

            {/* Start New Round Card */}
            <form onSubmit={handleStartRound}>
                <Card className="bg-secondary border">
                    <CardHeader><CardTitle>Start New Round</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Ticket Price (BDAG)</Label>
                                <Input id="price" placeholder="0.01" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration (Blocks)</Label>
                                <Input id="duration" placeholder="100" value={duration} onChange={(e) => setDuration(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="startSecret">Secret</Label>
                            <div className="flex items-center gap-2">
                                <Input id="startSecret" placeholder="Enter a secret string or generate one" value={startSecret} onChange={(e) => setStartSecret(e.target.value)} />
                                <Button type="button" variant="outline" onClick={handleGenerateSecret}><RefreshCw className="mr-2 h-4 w-4" /> Generate</Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full shadow-neon-green" disabled={isLoadingStart}>
                            {isLoadingStart && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoadingStart ? "Starting Round..." : "Start New Round"}
                        </Button>
                    </CardContent>
                </Card>
            </form>

            {/* Reveal Winner Card */}
            <form onSubmit={handleRevealWinner}>
                <Card className="bg-secondary border">
                    <CardHeader><CardTitle>Reveal Winner & Payout</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="revealSecret">Secret</Label>
                            <Input id="revealSecret" placeholder="Enter the secret used to start the round" value={revealSecret} onChange={(e) => setRevealSecret(e.target.value)} />
                        </div>
                        <div className="callout">
                            <AlertTriangle className="h-5 w-5 text-purple-400 mt-1" />
                            <div>
                                <h4 className="font-semibold">Important</h4>
                                <p className="text-muted-foreground text-sm">Can only be called after the round ends and within 256 blocks.</p>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoadingReveal}>
                            {isLoadingReveal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoadingReveal ? "Revealing Winner..." : "Reveal Winner & Payout"}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default AdminPanel;