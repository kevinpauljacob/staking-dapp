"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Code,
  Coins,
  TrendingUp,
  Lock,
  Unlock,
  Gift,
  Info,
  FileText,
  Zap,
  Shield,
  Calculator,
} from "lucide-react";

// Content sections data
const contentSections = [
  {
    id: "overview",
    title: "Staking Overview",
    icon: BookOpen,
    content: {
      description:
        "Understanding the fundamentals of Solana staking and how rewards are calculated.",
      points: [
        "Staking locks your SOL tokens to help secure the network",
        "Earn rewards based on network inflation and validator performance",
        "No slashing risk - your tokens remain safe",
        "Flexible unstaking with warmup/cooldown periods",
      ],
      codeExample: `// Basic staking calculation
const calculateRewards = (stakedAmount, apr, days) => {
  const dailyRate = apr / 365;
  return stakedAmount * (dailyRate / 100) * days;
};

// Example: 100 SOL staked at 7% APR for 30 days
const rewards = calculateRewards(100, 7, 30);
console.log(\`Estimated rewards: \${rewards.toFixed(4)} SOL\`);`,
    },
  },
  {
    id: "stake-process",
    title: "Staking Process",
    icon: Lock,
    content: {
      description:
        "Step-by-step breakdown of how the staking function operates internally.",
      points: [
        "Connect wallet and verify SOL balance",
        "Create stake account with system program",
        "Delegate stake account to chosen validator",
        "Account becomes active after warmup period",
      ],
      codeExample: `// Staking transaction structure
const stakeInstruction = StakeProgram.createAccount({
  fromPubkey: wallet.publicKey,
  stakePubkey: stakeAccount.publicKey,
  authorized: {
    staker: wallet.publicKey,
    withdrawer: wallet.publicKey,
  },
  lamports: stakeAmount * LAMPORTS_PER_SOL,
});

const delegateInstruction = StakeProgram.delegate({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: wallet.publicKey,
  votePubkey: validatorVoteAccount,
});`,
    },
  },
  {
    id: "unstake-process",
    title: "Unstaking Process",
    icon: Unlock,
    content: {
      description:
        "How to withdraw your staked SOL and the deactivation timeline.",
      points: [
        "Deactivate stake account to begin unstaking",
        "Wait for deactivation (usually 1-2 epochs)",
        "Withdraw SOL back to your wallet",
        "Partial unstaking supported",
      ],
      codeExample: `// Unstaking transaction
const deactivateInstruction = StakeProgram.deactivate({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: wallet.publicKey,
});

// After deactivation period
const withdrawInstruction = StakeProgram.withdraw({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: wallet.publicKey,
  toPubkey: wallet.publicKey,
  lamports: withdrawAmount * LAMPORTS_PER_SOL,
});`,
    },
  },
  {
    id: "rewards-collection",
    title: "Rewards Collection",
    icon: Gift,
    content: {
      description:
        "How staking rewards are accumulated and collected automatically.",
      points: [
        "Rewards are automatically added to stake accounts",
        "Compounding effect increases over time",
        "No manual claiming required",
        "Rewards begin after stake activation",
      ],
      codeExample: `// Fetching stake account info
const stakeAccountInfo = await connection.getAccountInfo(
  stakeAccount.publicKey
);

const stakeState = StakeState.fromBuffer(stakeAccountInfo.data);
if (stakeState.type === 'Delegated') {
  const { stake } = stakeState.info;
  console.log(\`Staked amount: \${stake.delegation.stake / LAMPORTS_PER_SOL} SOL\`);
  console.log(\`Activation epoch: \${stake.delegation.activationEpoch}\`);
}`,
    },
  },
  {
    id: "validators",
    title: "Validator Selection",
    icon: Shield,
    content: {
      description:
        "Choosing the right validator affects your staking rewards and network contribution.",
      points: [
        "Higher commission = lower rewards for you",
        "Check validator uptime and performance history",
        "Avoid over-concentrated validators",
        "Consider validator voting record",
      ],
      codeExample: `// Fetching validator information
const validators = await connection.getVoteAccounts();
const activeValidators = validators.current;

const sortedByCommission = activeValidators.sort((a, b) => 
  a.commission - b.commission
);

console.log('Top validators by low commission:');
sortedByCommission.slice(0, 5).forEach(v => {
  console.log(\`\${v.nodePubkey}: \${v.commission}% commission\`);
});`,
    },
  },
  {
    id: "economics",
    title: "Staking Economics",
    icon: Calculator,
    content: {
      description:
        "Understanding APR, inflation, and reward mechanisms in Solana staking.",
      points: [
        "Current network inflation rate: ~5-8% annually",
        "Validator commission reduces your rewards",
        "More staked = lower individual APR",
        "Rewards distributed every epoch (~2 days)",
      ],
      codeExample: `// APR calculation with commission
const calculateNetAPR = (networkAPR, validatorCommission) => {
  return networkAPR * (1 - validatorCommission / 100);
};

// Example calculation
const networkAPR = 7.5; // 7.5%
const commission = 5; // 5%
const netAPR = calculateNetAPR(networkAPR, commission);
console.log(\`Net APR: \${netAPR.toFixed(2)}%\`);`,
    },
  },
  {
    id: "technical-details",
    title: "Technical Implementation",
    icon: Code,
    content: {
      description:
        "Deep dive into the technical aspects of Solana staking program.",
      points: [
        "Built on Solana's native Stake Program",
        "Uses Proof of Stake consensus mechanism",
        "Cross Program Invocation (CPI) for complex operations",
        "Account rent exemption requirements",
      ],
      codeExample: `// Complete staking program interaction
import { 
  Connection, 
  PublicKey, 
  Transaction,
  StakeProgram,
  Authorized,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

const createStakeAccount = async (
  connection: Connection,
  wallet: any,
  stakeAmount: number,
  validatorVote: PublicKey
) => {
  const stakeAccount = Keypair.generate();

  const transaction = new Transaction().add(
    StakeProgram.createAccount({
      fromPubkey: wallet.publicKey,
      stakePubkey: stakeAccount.publicKey,
      authorized: new Authorized(
        wallet.publicKey,
        wallet.publicKey
      ),
      lamports: stakeAmount * LAMPORTS_PER_SOL,
    }),
    StakeProgram.delegate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: wallet.publicKey,
      votePubkey: validatorVote,
    })
  );

  return transaction;
};`,
    },
  },
];

export default function ScrollableContentWithStickyNav() {
  const [activeSection, setActiveSection] = useState("overview");
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: contentRef.current,
        rootMargin: "-20% 0px -80% 0px",
        threshold: 0,
      }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      const container = contentRef.current;
      const elementTop = element.offsetTop;
      const containerTop = container.scrollTop;
      const offset = elementTop - containerTop - 20; // 20px offset from top

      container.scrollTo({
        top: containerTop + offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sticky Navigation Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Staking Guide
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Learn how staking works internally
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-2">
            <nav className="space-y-1">
              {contentSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <Button
                    key={section.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      isActive ? "bg-secondary border-l-2 border-primary" : ""
                    }`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-left text-sm">{section.title}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </ScrollArea>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1">
        <ScrollArea className="h-full" ref={contentRef}>
          <div className="p-6 space-y-8">
            {contentSections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.id}
                  id={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className="scroll-mt-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground">
                        {section.content.description}
                      </p>

                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Key Points
                        </h4>
                        <ul className="space-y-2">
                          {section.content.points.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Badge
                                variant="outline"
                                className="mt-0.5 text-xs"
                              >
                                {index + 1}
                              </Badge>
                              <span className="text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Code Example
                        </h4>
                        <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm">
                            <code>{section.content.codeExample}</code>
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
