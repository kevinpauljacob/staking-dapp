import * as anchor from "@coral-xyz/anchor";
import { IdlTypes, Program } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { config } from "dotenv";
import IDL from "../target/idl/staking.json";
import { Staking } from "../target/types/staking";

config({ path: "./tests/.env" });

const logTxnSignature = (tx: string) => {
  console.log(
    "Your transaction signature",
    `https://explorer.solana.com/tx/${tx}?cluster=devnet`
  );
};

type Global = IdlTypes<Staking>["global"];

const TOKEN_MINT = new PublicKey(
  IDL.constants.find((c) => c.name === "TOKEN_PUBKEY")!.value
);

const getGlobalAddress = (program: Program<Staking>) => {
  const GLOBAL_SEED = "global";

  const [globalPublicKey] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_SEED)],
    program.programId
  );
  return globalPublicKey;
};

const getGlobalInfo = async (program: Program<Staking>) => {
  const globalPublicKey = getGlobalAddress(program);

  const globalInfo = await program.account.global.fetch(
    globalPublicKey,
    "confirmed"
  );
  return globalInfo;
};

describe("staking", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.staking as Program<Staking>;

  const adminKeypair = Keypair.fromSecretKey(
    bs58.decode(process.env.ADMIN_PRIVATE_KEY!)
  );
  const admin = adminKeypair.publicKey;

  /**---------------- ADMIN INSTRUCTIONS ----------------*/

  it.skip("Set Params", async () => {
    const emissionRate = new BN(2762);

    const tx = await program.methods
      .setParams(emissionRate)
      .accounts({ admin })
      .rpc();

    logTxnSignature(tx);

    const globalPublicKey = getGlobalAddress(program);
    const associatedGlobal = getAssociatedTokenAddressSync(
      TOKEN_MINT,
      globalPublicKey,
      true
    );

    console.log("Vault Address: ", associatedGlobal.toBase58());
  });
});
