"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Code,
  Coins,
  Lock,
  Unlock,
  Gift,
  Shield,
  Calculator,
  Info,
  Lightbulb,
} from "lucide-react";
import TableOfContents from "./TableContent";

// Define the content structure for your staking DApp
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
    icon: Info,
    category: "basics",
  },
  {
    id: "reward-mechanics",
    title: "Reward Mechanics",
    level: 2,
    icon: Calculator,
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
    icon: Shield,
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
    icon: Calculator,
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

export default function StakingDAppLayout() {
  const [activeTab, setActiveTab] = useState("all");

  // Filter content based on active tab
  const filteredContent =
    activeTab === "all"
      ? stakingContent
      : stakingContent.filter((item) => item.category === activeTab);

  return (
    <div className="min-h-screen bg-background">
      {/* Main container with two-column layout */}
      <div className="flex h-screen">
        {/* Left Side - Educational Content with Sticky Nav */}
        <div className="w-1/2 border-r bg-card">
          <div className="flex h-full">
            {/* Table of Contents - Sticky Navigation */}
            <div className="w-80 border-r bg-muted/30">
              <div className="p-4">
                {/* Tab selector for different content categories */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mb-4"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="basics" className="text-xs">
                      Basics
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-2 mt-1">
                    <TabsTrigger value="functions" className="text-xs">
                      Functions
                    </TabsTrigger>
                    <TabsTrigger value="rewards" className="text-xs">
                      Rewards
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <TableOfContents
                  items={filteredContent}
                  containerId="educational-content"
                  title="Staking Guide"
                  subtitle="Learn how staking works"
                  className="border-0 shadow-none bg-transparent"
                />
              </div>
            </div>

            {/* Educational Content - Scrollable */}
            <div className="flex-1">
              <div className="p-4 border-b bg-background">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Educational Content
                </h2>
                <p className="text-sm text-muted-foreground">
                  Understanding Solana staking internals
                </p>
              </div>

              <div
                className="h-[calc(100vh-80px)] overflow-y-auto"
                id="educational-content"
              >
                <div className="p-6 space-y-8">
                  {filteredContent.map((section) => {
                    const Icon = section.icon;

                    return (
                      <section
                        key={section.id}
                        id={section.id}
                        className="scroll-mt-6"
                      >
                        <Card className="border-l-4 border-l-primary">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3
                                  className={`font-semibold mb-3 ${
                                    section.level === 1
                                      ? "text-lg"
                                      : "text-base"
                                  }`}
                                >
                                  {section.title}
                                </h3>

                                {/* Sample educational content */}
                                <div className="space-y-4 text-sm text-muted-foreground">
                                  <p>
                                    This section explains{" "}
                                    {section.title.toLowerCase()}. Here you
                                    would include detailed explanations of how
                                    this component of staking works internally.
                                  </p>

                                  {/* Code example placeholder */}
                                  <div className="bg-muted rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Code className="h-4 w-4" />
                                      <span className="text-xs font-medium">
                                        Code Example
                                      </span>
                                    </div>
                                    <pre className="text-xs text-muted-foreground">
                                      {`// ${section.title} implementation
const ${section.id.replace(/-/g, "")} = async () => {
  // Implementation details here
  console.log('${section.title} executed');
};`}
                                    </pre>
                                  </div>

                                  {/* Additional explanation */}
                                  <p>
                                    The implementation involves multiple steps
                                    and considerations. This is where you would
                                    provide in-depth technical explanations.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </section>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Functional Staking Interface */}
        <div className="w-1/2 bg-background">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Staking Interface
            </h2>
            <p className="text-sm text-muted-foreground">
              Interact with staking contracts
            </p>
          </div>

          <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
            {/* Staking Interface Tabs */}
            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stake" className="flex items-center gap-2">
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

              <TabsContent value="stake" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Stake SOL</h3>
                      <p className="text-sm text-muted-foreground">
                        Lock your SOL tokens to earn staking rewards
                      </p>

                      {/* Placeholder for staking interface */}
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div>
                          <label className="text-sm font-medium">
                            Amount to Stake
                          </label>
                          <div className="mt-1 p-3 border rounded bg-background">
                            <span className="text-sm text-muted-foreground">
                              Staking input component here
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Select Validator
                          </label>
                          <div className="mt-1 p-3 border rounded bg-background">
                            <span className="text-sm text-muted-foreground">
                              Validator selection component here
                            </span>
                          </div>
                        </div>

                        <Button className="w-full" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Stake SOL (Component Placeholder)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="unstake" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Unstake SOL</h3>
                      <p className="text-sm text-muted-foreground">
                        Withdraw your staked SOL tokens
                      </p>

                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div className="text-sm text-muted-foreground">
                          Unstaking interface component here
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full"
                          disabled
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Unstake SOL (Component Placeholder)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Staking Rewards</h3>
                      <p className="text-sm text-muted-foreground">
                        View and collect your staking rewards
                      </p>

                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div className="text-sm text-muted-foreground">
                          Rewards display and collection component here
                        </div>
                        <Button className="w-full" disabled>
                          <Gift className="h-4 w-4 mr-2" />
                          Collect Rewards (Component Placeholder)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
