"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import {
  useScrollSpy,
  useScrollToSectionInContainer,
} from "../hooks/useScrollSpy";

interface TOCItem {
  id: string;
  title: string;
  level: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TableOfContentsProps {
  items: TOCItem[];
  containerId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function TableOfContents({
  items,
  containerId = "scroll-container",
  title = "On this page",
  subtitle,
  className = "",
}: TableOfContentsProps) {
  const sectionIds = items.map((item) => item.id);
  const activeSection = useScrollSpy(sectionIds, {
    rootMargin: "-10% 0px -85% 0px",
    threshold: 0.1,
  });

  const scrollToSection = useScrollToSectionInContainer();

  const handleSectionClick = (sectionId: string) => {
    scrollToSection(sectionId, containerId, 20);
  };

  return (
    <Card className={`sticky ${className}  gap-0  my-0 py-0`}>
      <div className="p-4 border-b bg-background">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <CardContent className="pt-0 ">
        <ScrollArea className="h-fit">
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start h-auto py-2 px-3 text-left ${
                    isActive
                      ? "bg-accent text-accent-foreground border-l-2 border-primary font-medium"
                      : "hover:bg-muted"
                  } ${item.level > 1 ? `ml-${(item.level - 1) * 4}` : ""}`}
                  onClick={() => handleSectionClick(item.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    {Icon && <Icon className="h-3 w-3 flex-shrink-0" />}
                    <span className="text-xs truncate">{item.title}</span>
                    {isActive && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-xs px-1"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Example usage component
export function ExampleUsage() {
  const tocItems: TOCItem[] = [
    { id: "overview", title: "Staking Overview", level: 1 },
    { id: "how-it-works", title: "How Staking Works", level: 2 },
    { id: "rewards", title: "Understanding Rewards", level: 2 },
    { id: "stake-process", title: "Staking Process", level: 1 },
    { id: "connect-wallet", title: "Connect Wallet", level: 2 },
    { id: "select-validator", title: "Select Validator", level: 2 },
    { id: "confirm-stake", title: "Confirm Staking", level: 2 },
    { id: "unstake-process", title: "Unstaking Process", level: 1 },
    { id: "deactivate", title: "Deactivate Stake", level: 2 },
    { id: "withdraw", title: "Withdraw Funds", level: 2 },
    { id: "rewards-collection", title: "Rewards Collection", level: 1 },
    { id: "auto-compound", title: "Auto Compounding", level: 2 },
    { id: "manual-claim", title: "Manual Claims", level: 2 },
  ];

  return (
    <div className="flex gap-6 h-screen">
      {/* Table of Contents - Left Side */}
      <div className="w-80 p-4">
        <TableOfContents
          items={tocItems}
          containerId="main-content"
          title="Staking Guide"
          subtitle="Navigate through the staking process"
        />
      </div>

      {/* Main Content - Right Side */}
      <div className="flex-1">
        <ScrollArea className="h-full" id="main-content">
          <div className="p-6 space-y-12">
            {tocItems.map((item) => (
              <section key={item.id} id={item.id} className="scroll-mt-6">
                <div className="border-l-4 border-primary pl-4">
                  <h2
                    className={`${
                      item.level === 1 ? "text-2xl" : "text-xl"
                    } font-bold mb-4`}
                  >
                    {item.title}
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground mb-4">
                      This section covers {item.title.toLowerCase()}. Here you
                      would have your actual content explaining the concepts and
                      providing examples.
                    </p>

                    {/* Sample content to make sections scrollable */}
                    <div className="space-y-4">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                      </p>
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      {item.level === 1 && (
                        <>
                          <p>
                            Sed ut perspiciatis unde omnis iste natus error sit
                            voluptatem accusantium doloremque laudantium, totam
                            rem aperiam, eaque ipsa quae ab illo inventore
                            veritatis et quasi architecto beatae vitae dicta
                            sunt explicabo.
                          </p>
                          <p>
                            Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur
                            magni dolores eos qui ratione voluptatem sequi
                            nesciunt.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
