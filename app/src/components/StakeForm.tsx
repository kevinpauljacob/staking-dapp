// components/StakeForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface StakeFormProps {
  balance: number; // user token balance
  stakedAmount: number; // already staked
  onStake: (amount: number) => Promise<void>;
}

export default function StakeForm({
  balance,
  stakedAmount,
  onStake,
}: StakeFormProps) {
  const [amount, setAmount] = useState("");
  const [unlockDate] = useState(() => {
    // Example: stake unlocks immediately (no lockup)
    return new Date();
  });
  const [loading, setLoading] = useState(false);

  const handlePercent = (pct: number) => {
    setAmount(((balance * pct) / 100).toFixed(4));
  };

  const handleSubmit = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    setLoading(true);
    await onStake(val);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Balance Display */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Wallet Balance</div>
        <div className="text-lg font-semibold">
          {balance.toFixed(4)}
          <span className="text-xs ml-1">TKN</span>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <Label htmlFor="stake-amount">Stake Amount</Label>
        <Input
          id="stake-amount"
          type="number"
          placeholder="0.0000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-xl"
        />
      </div>

      {/* Quick Percents */}
      <div className="flex space-x-2">
        {[25, 50, 75, 100].map((pct) => (
          <Button
            key={pct}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handlePercent(pct)}
          >
            {pct} %
          </Button>
        ))}
      </div>

      {/* Unlock Info */}
      <div className="text-sm text-muted-foreground">
        Unlocks {formatDistanceToNow(unlockDate, { addSuffix: true })}
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div>Current Stake</div>
        <div>{stakedAmount.toFixed(4)} TKN</div>
      </div>
      <div className="flex justify-between text-sm">
        <div>Total Stake</div>
        <div>{(stakedAmount + parseFloat(amount || "0")).toFixed(4)} TKN</div>
      </div>

      {/* Action */}
      <Button
        className="w-full"
        disabled={loading || parseFloat(amount || "0") <= 0}
        onClick={handleSubmit}
      >
        {loading ? "Processing…" : "Stake Tokens"}
      </Button>
    </div>
  );
}
