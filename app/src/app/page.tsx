"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Coins,
  Lock,
  Unlock,
  Gift,
  Wallet,
  TrendingUp,
  Shield,
  Code,
} from "lucide-react";

// Import your custom components
import TableOfContents from "@/components/TableContent";
import WalletConnection from "@/components/WalletConnectionButton";
import EducationalPane from "@/components/EducationalPane";
import contentSections from "@/data/contentSections";
import {
  useScrollSpy,
  useScrollToSectionInContainer,
} from "@/hooks/useScrollSpy";
import StakeForm from "@/components/StakeForm";
import UnstakeForm from "@/components/UnstakeForm";
import RewardsView from "@/components/RewardsView";

// Staking content structure
const stakingContent = [
  {
    id: "staking-overview",
    title: "Staking Overview",
    level: 1,
    icon: BookOpen,
    category: "basics",
  },
  {
    id: "how-staking-works",
    title: "How Staking Works",
    level: 2,
    icon: Shield,
    category: "basics",
  },
  {
    id: "reward-mechanics",
    title: "Reward Mechanics",
    level: 2,
    icon: TrendingUp,
    category: "basics",
  },
  {
    id: "stake-function",
    title: "Stake Function",
    level: 1,
    icon: Lock,
    category: "functions",
  },
  {
    id: "wallet-connection",
    title: "Wallet Connection",
    level: 2,
    icon: Wallet,
    category: "functions",
  },
  {
    id: "stake-account-creation",
    title: "Stake Account Creation",
    level: 2,
    icon: Code,
    category: "functions",
  },
  {
    id: "validator-delegation",
    title: "Validator Delegation",
    level: 2,
    icon: Shield,
    category: "functions",
  },
  {
    id: "unstake-function",
    title: "Unstake Function",
    level: 1,
    icon: Unlock,
    category: "functions",
  },
  {
    id: "deactivation-process",
    title: "Deactivation Process",
    level: 2,
    icon: Code,
    category: "functions",
  },
  {
    id: "withdrawal-process",
    title: "Withdrawal Process",
    level: 2,
    icon: Coins,
    category: "functions",
  },
  {
    id: "rewards-collection",
    title: "Rewards Collection",
    level: 1,
    icon: Gift,
    category: "rewards",
  },
  {
    id: "auto-compounding",
    title: "Auto Compounding",
    level: 2,
    icon: TrendingUp,
    category: "rewards",
  },
  {
    id: "reward-calculation",
    title: "Reward Calculation",
    level: 2,
    icon: Code,
    category: "rewards",
  },
];

const educationalContent: Record<
  string,
  {
    title: string;
    description: string;
    keyPoints?: string[];
    codeExample?: string;
  }
> = {
  "staking-overview": {
    title: "Staking Overview",
    description:
      "Solana staking allows you to earn rewards by delegating your SOL tokens to validators who help secure the network.",
    keyPoints: [
      "Earn passive income through network rewards",
      "Help secure the Solana blockchain",
      "No risk of slashing - your tokens are safe",
      "Flexible delegation and withdrawal options",
    ],
    codeExample: `// Basic staking rewards calculation
const calculateAnnualRewards = (
  stakedAmount: number, 
  apr: number
) => {
  return stakedAmount * (apr / 100);
};

// Example: 100 SOL at 7% APR
const rewards = calculateAnnualRewards(100, 7);
console.log(\`Annual rewards: \${rewards} SOL\`);`,
  },
  "how-staking-works": {
    title: "How Staking Works",
    description:
      "Staking on Solana involves delegating your SOL to validators who process transactions and secure the network.",
    keyPoints: [
      "Validators process transactions and create blocks",
      "Stakers delegate SOL to validators of their choice",
      "Rewards are distributed based on validator performance",
      "Stake accounts track your delegation and rewards",
    ],
    codeExample: `// Solana Proof of Stake mechanism
const stakingProcess = {
  delegation: 'SOL tokens delegated to validator',
  validation: 'Validator processes transactions',
  rewards: 'Network distributes inflation rewards',
  compounding: 'Rewards automatically compound'
};`,
  },
  "stake-function": {
    title: "Stake Function Implementation",
    description:
      "The staking function creates a stake account and delegates it to a chosen validator.",
    keyPoints: [
      "Create a new stake account with system program",
      "Fund the account with desired SOL amount",
      "Delegate the stake account to a validator",
      "Wait for activation (1-2 epochs)",
    ],
    codeExample: `import { 
  StakeProgram, 
  Authorized, 
  Lockup,
  PublicKey,
  Transaction
} from '@solana/web3.js';

const createStakeAccount = async (
  connection: Connection,
  payer: Keypair,
  stakeAmount: number,
  validatorVote: PublicKey
) => {
  const stakeAccount = Keypair.generate();

  const createAccountInstruction = StakeProgram.createAccount({
    fromPubkey: payer.publicKey,
    stakePubkey: stakeAccount.publicKey,
    authorized: new Authorized(
      payer.publicKey, // staker
      payer.publicKey  // withdrawer
    ),
    lockup: new Lockup(0, 0, payer.publicKey),
    lamports: stakeAmount * LAMPORTS_PER_SOL,
  });

  const delegateInstruction = StakeProgram.delegate({
    stakePubkey: stakeAccount.publicKey,
    authorizedPubkey: payer.publicKey,
    votePubkey: validatorVote,
  });

  const transaction = new Transaction()
    .add(createAccountInstruction)
    .add(delegateInstruction);

  return transaction;
};`,
  },
  // Add more content sections as needed...
};

export default function StakingDAppPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const ids = contentSections.map((s) => s.id);
  const active = useScrollSpy(ids, { rootMargin: "-10% 0px -85% 0px" });
  const scrollTo = useScrollToSectionInContainer();
  const userBalance = balance;
  const stakedAmount = 50.0; // Example staked amount
  const totalEarned = 5.0; // Example total earned rewards
  const claimed = 2.0; // Example claimed rewards
  const claimedRewards = claimed;
  const unclaimedRewards = totalEarned - claimedRewards;

  const handleClaimRewards = async () => {
    // Implement claim rewards functionality
  };

  const handleStake = async (amount: number) => {
    // Implement stake functionality
  };

  const handleUnstake = async (amount: number) => {
    // Implement unstake functionality
  };

  // Fetch wallet balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [connected, publicKey, connection]);

  return (
    <div className="bg-background pb-4">
      {/* Main Content */}
      <main className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] ">
        {/* Left Side - Educational Content */}
        <section className="order-2 md:order-1 md:w-[70%] w-full md:border-r  px-4 md:px-0">
          <div className="flex h-full">
            <div className="w-80 border-r ">
              <div className="p-4 border-b bg-background hidden lg:block">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Staking Guide
                </h2>
                <p className="text-sm text-muted-foreground">
                  Navigate through concepts
                </p>
              </div>
              <div className="sticky top-4 float-right hidden p-3 max-w-xs z-10 w-80  bg-background lg:flex flex-col items-end">
                {contentSections.map((sec) => (
                  <button
                    key={sec.id}
                    className={`block w-fit text-right text-sm mb-1 ${
                      active === sec.id
                        ? "font-bold text-primary scale-100 "
                        : "text-muted-foreground hover:text-foreground scale-95"
                    }`}
                    onClick={() => scrollTo(sec.id, "edu-content", 80)}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Educational Content - Scrollable */}
            <div className="md:flex-1 ">
              <div className="p-4 border-b bg-background">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Eductional Content
                </h2>
                <p className="text-sm text-muted-foreground">
                  Understanding Solana staking internals
                </p>
              </div>

              <EducationalPane />
            </div>
          </div>
        </section>

        {/* Right Side - Functional Staking Interface */}
        <section className="order-1 md:order-2 md:w-[30%] w-full ">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Staking Interface
            </h2>
            <p className="text-sm text-muted-foreground">
              Interact with staking contracts
            </p>
          </div>

          <div className="p-6 h-[calc(100vh-160px)] overflow-y-auto">
            {!connected ? (
              <div className="flex items-center justify-center h-full">
                <Card className="p-8 text-center">
                  <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Please connect your Solana wallet to access staking features
                  </p>
                  <WalletConnection />
                </Card>
              </div>
            ) : (
              <Tabs defaultValue="stake" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="stake"
                    className="flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Stake
                  </TabsTrigger>
                  <TabsTrigger
                    value="unstake"
                    className="flex items-center gap-2"
                  >
                    <Unlock className="h-4 w-4" />
                    Unstake
                  </TabsTrigger>
                  <TabsTrigger
                    value="rewards"
                    className="flex items-center gap-2"
                  >
                    <Gift className="h-4 w-4" />
                    Rewards
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stake">
                  <StakeForm
                    balance={userBalance!}
                    stakedAmount={stakedAmount}
                    onStake={handleStake}
                  />
                </TabsContent>
                <TabsContent value="unstake">
                  <UnstakeForm
                    stakedAmount={stakedAmount}
                    onUnstake={handleUnstake}
                  />
                </TabsContent>
                <TabsContent value="rewards">
                  <RewardsView
                    totalEarned={totalEarned}
                    claimed={claimedRewards}
                    claimable={unclaimedRewards}
                    onClaim={handleClaimRewards}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
