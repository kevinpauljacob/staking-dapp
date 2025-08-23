// components/UnstakeForm.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UnstakeFormProps {
  stakedAmount: number;
  onUnstake: (amount: number) => Promise<void>;
}

export default function UnstakeForm({
  stakedAmount,
  onUnstake,
}: UnstakeFormProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePercent = (pct: number) => {
    setAmount(((stakedAmount * pct) / 100).toFixed(4));
  };

  const handleSubmit = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    setLoading(true);
    await onUnstake(val);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Staked Display */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Currently Staked</div>
        <div className="text-lg font-semibold">
          {stakedAmount.toFixed(4)}
          <span className="text-xs ml-1">TKN</span>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <Label htmlFor="unstake-amount">Unstake Amount</Label>
        <Input
          id="unstake-amount"
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

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div>Remaining Stake</div>
        <div>{(stakedAmount - parseFloat(amount || "0")).toFixed(4)} TKN</div>
      </div>

      {/* Action */}
      <Button
        className="w-full"
        variant="destructive"
        disabled={loading || parseFloat(amount || "0") <= 0}
        onClick={handleSubmit}
      >
        {loading ? "Processing…" : "Unstake Tokens"}
      </Button>
    </div>
  );
}
