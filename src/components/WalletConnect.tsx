import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Copy, LogOut } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ethers } from 'ethers';

interface WalletConnectProps {
    account: string | null;
    setAccount: (account: string | null) => void;
    setProvider: (provider: ethers.providers.Web3Provider | null) => void;
    isHeaderButton?: boolean;
}

const WalletConnect = ({ account, setAccount, setProvider, isHeaderButton = false }: WalletConnectProps) => {
    const { toast } = useToast();
    const [balance, setBalance] = useState("0");

    useEffect(() => {
        const fetchBalance = async () => {
            if (account && window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const ethBalance = await provider.getBalance(account);
                setBalance(parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(4));
            }
        };
        fetchBalance();
    }, [account]);

    const handleConnect = async () => {
        if (!window.ethereum) {
            toast({ title: "MetaMask Not Found", description: "Please install the MetaMask browser extension.", variant: "destructive" });
            return;
        }
        try {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            await web3Provider.send("eth_requestAccounts", []);
            const signer = web3Provider.getSigner();
            const address = await signer.getAddress();
            setProvider(web3Provider);
            setAccount(address);
            toast({ title: "Wallet Connected!", description: `Address: ${address.substring(0, 6)}...` });
        } catch (error) {
            toast({ title: "Connection Failed", description: "You rejected the connection request.", variant: "destructive" });
        }
    };

    const handleDisconnect = () => {
        setAccount(null);
        setProvider(null);
    };

    if (isHeaderButton) {
        return account ? (
            <div className="text-sm font-mono text-muted-foreground">
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
            </div>
        ) : (
            <Button onClick={handleConnect} size="sm">Connect</Button>
        );
    }

    if (!account) {
        return <Button onClick={handleConnect} className="w-full shadow-neon-green">Connect MetaMask</Button>;
    }

    return (
        <Card className="bg-secondary border w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle>Wallet Connected</CardTitle>
                <Badge variant="outline" className="text-primary border-primary">Active</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="text-xs text-muted-foreground">Address</Label>
                    <div className="flex items-center justify-between p-2 bg-background rounded-md">
                        <span className="font-mono text-sm truncate">{account}</span>
                        <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(account)}><Copy className="h-4 w-4" /></Button>
                    </div>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">BDAG Balance</Label>
                    <div className="p-2 bg-background rounded-md">
                        <span className="font-mono text-sm">{balance} BDAG</span>
                    </div>
                </div>
                <Button variant="outline" onClick={handleDisconnect} className="w-full">
                    <LogOut className="mr-2 h-4 w-4"/> Disconnect
                </Button>
            </CardContent>
        </Card>
    );
};

export default WalletConnect;