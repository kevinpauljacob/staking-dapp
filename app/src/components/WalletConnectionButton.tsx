// components/WalletConnectionButton.tsx
"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";

export default function WalletConnectionButton() {
  const { publicKey, connected, connecting, disconnect, disconnecting } =
    useWallet();
  const { setVisible } = useWalletModal();
  const [open, setOpen] = useState(false);

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  if (!connected) {
    return (
      <Button onClick={() => setVisible(true)} disabled={connecting}>
        {connecting ? "Connecting…" : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div className="relative inline-block">
      <Button onClick={() => setOpen((o) => !o)}>
        {truncate(publicKey!.toString())} ▾
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded shadow-lg">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-muted"
            onClick={() =>
              window.open(
                `https://explorer.solana.com/address/${publicKey!.toString()}?cluster=devnet`,
                "_blank"
              )
            }
          >
            View on Explorer
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-muted"
            onClick={() => {
              navigator.clipboard.writeText(publicKey!.toString());
              alert("Copied!");
            }}
          >
            Copy Address
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-destructive hover:bg-muted"
            onClick={() => disconnect()}
            disabled={disconnecting}
          >
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </button>
        </div>
      )}
    </div>
  );
}
