import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletConnect from "./components/WalletConnect";
import LotteryDashboard from "./components/LotteryDashboard";
import BuyTickets from "./components/BuyTickets";
import History from "./components/History";
import AdminPanel from "./components/AdminPanel";
import { Blocks, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OWNER_ADDRESS } from "./constants";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const isOwner = account?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  useEffect(() => {
    const tryAutoConnect = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setProvider(web3Provider);
          }
        } catch (error) { console.error("Failed to auto-connect:", error); }
      }
    };
    tryAutoConnect();
  }, []);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Blocks className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Block DAG Lottery</h1>
          </div>
          <WalletConnect account={account} setAccount={setAccount} setProvider={setProvider} isHeaderButton={true} />
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {!account ? (
          <div className="flex justify-center mt-16">
            <Card className="w-full max-w-md bg-secondary border">
              <CardHeader className="text-center">
                <Landmark className="mx-auto h-8 w-8 text-primary mb-2" />
                <CardTitle>Connect Wallet</CardTitle>
                <CardDescription>Connect to the BlockDAG Testnet to participate</CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnect account={account} setAccount={setAccount} setProvider={setProvider} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <WalletConnect account={account} setAccount={setAccount} setProvider={setProvider} />
            </div>
            <Tabs defaultValue="lottery" className="w-full md:mt-8">
              <TabsList className="bg-secondary">
                <TabsTrigger value="lottery">Lottery</TabsTrigger>
                <TabsTrigger value="buy">Buy Tickets</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                {isOwner && <TabsTrigger value="admin">Admin</TabsTrigger>}
              </TabsList>
              <div className="mt-6">
                <TabsContent value="lottery"><LotteryDashboard provider={provider} refreshKey={refreshKey} /></TabsContent>
                <TabsContent value="buy"><BuyTickets provider={provider} onTicketBought={triggerRefresh} /></TabsContent>
                <TabsContent value="history"><History provider={provider} /></TabsContent>
                {isOwner && <TabsContent value="admin"><AdminPanel provider={provider} /></TabsContent>}
              </div>
            </Tabs>
          </>
        )}
      </main>
      <Toaster />
    </div>
  );
}
export default App;