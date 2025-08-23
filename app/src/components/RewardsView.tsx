// components/RewardsView.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Diamond } from "lucide-react";

interface RewardsViewProps {
  totalEarned: number;
  claimed: number;
  claimable: number;
  onClaim: () => Promise<void>;
}

export default function RewardsView({
  totalEarned,
  claimed,
  claimable,
  onClaim,
}: RewardsViewProps) {
  const [loading, setLoading] = React.useState(false);

  const handleClaim = async () => {
    setLoading(true);
    await onClaim();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Total Earned */}
      <div className="flex items-center justify-center space-x-3">
        <Diamond className="h-6 w-6 text-primary" />
        <div className="text-2xl font-bold">{totalEarned.toFixed(4)} TKN</div>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Total Rewards Earned
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Claimed</span>
          <span>{claimed.toFixed(4)} TKN</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Claimable</span>
          <span>{claimable.toFixed(4)} TKN</span>
        </div>
      </div>

      {/* Claim Button */}
      <Button
        className="w-full"
        disabled={loading || claimable === 0}
        onClick={handleClaim}
      >
        {loading ? "Claiming…" : "Claim Rewards"}
      </Button>
    </div>
  );
}
