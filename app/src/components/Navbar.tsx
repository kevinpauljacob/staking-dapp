import React from "react";
import ThemeToggle from "./ThemeToggle";
import WalletConnectionButton from "@/components/WalletConnectionButton";
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-card border-b font-poppins ">
      <h1 className="text-xl font-medium">Solana Staking DApp</h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <WalletConnectionButton />
      </div>
    </nav>
  );
};

export default Navbar;
