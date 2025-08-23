export interface Section {
  id: string;
  title: string;
  icon:
    | "BookOpen"
    | "Lock"
    | "Calculator"
    | "Unlock"
    | "Gift"
    | "Shield"
    | "Code";
  content: {
    description: string;
    points: string[];
    codeExample: string;
  };
}

export const contentSections: Section[] = [
  {
    id: "Overview",
    title: "Overview",
    icon: "BookOpen",
    content: {
      description:
        "A custom token staking protocol built on Solana using the Anchor framework. Users stake custom SPL tokens to earn rewards based on an emission rate controlled by the protocol admin.",
      points: [
        "Stake custom SPL tokens (not SOL) to earn continuous rewards",
        "Flexible emission rate system allows dynamic reward adjustments",
        "Real-time reward calculation based on exact staking duration",
        "No lock-up periods or penalties - unstake anytime",
        "Automatic reward compounding through unclaimed amount tracking",
      ],
      codeExample: `// Staking Protocol Key Addresses
const PROGRAM_ID = "xxx123456789009876543212345678909876543xxx";
const TOKEN_MINT = "xxx123456789009876543212345678909876543xxx";
const ADMIN_PUBKEY = "xxx123456789009876543212345678909876543xxx";

// Protocol Statistics
interface ProtocolStats {
  totalStaked: number;
  currentEmissionRate: number;
  activeStakers: number;
  totalRewardsPaid: number;
}`,
    },
  },

  {
    id: "staking-mechanism",
    title: "Staking Mechanism",
    icon: "Lock",
    content: {
      description:
        "Step-by-step breakdown of how the staking function creates accounts, validates amounts, and securely transfers tokens.",
      points: [
        "Create or initialize user's stake account using PDA derivation",
        "Validate staking amount is greater than zero and within balance",
        "Transfer tokens from user's associated account to stake account",
        "Update global protocol statistics (total staked amount)",
        "Begin immediate reward accumulation based on emission rate",
      ],
      codeExample: `// Staking Transaction Structure
const stakeInstruction = await program.methods
  .stakeToken(new BN(stakeAmount))
  .accounts({
    stake: stakePDA,           // ['stake', user.publicKey]
    global: globalPDA,         // ['global']
    user: user.publicKey,
    tokenMint: TOKEN_MINT,
    associatedStake: stakeTokenAccount,
    associatedUser: userTokenAccount,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .instruction();

// PDA Derivation
const [stakePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("stake"), user.publicKey.toBuffer()],
  program.programId
);`,
    },
  },

  {
    id: "reward-calculation",
    title: "Reward Calculation System",
    icon: "Calculator",
    content: {
      description:
        "Understanding the mathematical formula behind reward distribution and how time-based rewards are calculated in real-time.",
      points: [
        "Rewards = (Staked Amount ÷ 10^decimals) × Emission Rate × Days Staked",
        "Calculation triggered on every stake/unstake/claim interaction",
        "Time measured from last update to current timestamp",
        "Emission rate represents tokens earned per day per unit staked",
        "Unclaimed rewards automatically compound without manual action",
      ],
      codeExample: `// Reward Calculation Implementation
impl Stake {
    pub fn update_unclaimed_amount(&mut self, global: &Global, decimals: u8) -> Result<()> {
        let curr_time: i64 = Clock::get()?.unix_timestamp;
        let staked_duration = (curr_time - self.updated_at) as f64 / 86400.0; // Days

        let daily_rewards = (self.amount / 10u64.pow(decimals as u32)) * global.emission_rate;
        let unclaimed_amount = (daily_rewards as f64 * staked_duration) as u64;

        self.unclaimed_amount += unclaimed_amount;
        self.updated_at = curr_time;
        Ok(())
    }
}

// Example Calculation
// Staked: 1,000 tokens (6 decimals)
// Emission Rate: 10 tokens/day/unit  
// Duration: 7 days
// Rewards: (1000 / 10^6) × 10 × 7 = 0.07 tokens per 7 days`,
    },
  },

  {
    id: "unstaking-process",
    title: "Unstaking Process",
    icon: "Unlock",
    content: {
      description:
        "How tokens are safely withdrawn from staking with automatic reward calculations and flexible partial unstaking.",
      points: [
        "Update and calculate any pending rewards before unstaking",
        "Support for partial unstaking - specify exact amount to withdraw",
        "Secure token transfer using PDA signer seeds for authorization",
        "Update both user stake amount and global protocol statistics",
        "No cooldown periods or withdrawal penalties applied",
      ],
      codeExample: `// Unstaking Transaction
const unstakeInstruction = await program.methods
  .unstakeToken(new BN(unstakeAmount))
  .accounts({
    stake: stakePDA,
    global: globalPDA, 
    user: user.publicKey,
    tokenMint: TOKEN_MINT,
    associatedStake: stakeTokenAccount,
    associatedUser: userTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .instruction();

// Signer Seeds for PDA Authority
let signer_seeds: &[&[&[u8]]] = &[&[
  b"stake",
  user.key().as_ref(), 
  &[stake_bump]
]];

// Transfer with PDA Signer
transfer(
  CpiContext::new_with_signer(
    token_program,
    Transfer {
      from: stake_account,
      to: user_account, 
      authority: stake_pda,
    },
    signer_seeds,
  ),
  unstake_amount,
)?;`,
    },
  },

  {
    id: "reward-claiming",
    title: "Reward Collection",
    icon: "Gift",
    content: {
      description:
        "How accumulated rewards are claimed from the global protocol vault with proper validation and security checks.",
      points: [
        "Calculate and update current unclaimed reward amount",
        "Verify global vault has sufficient balance for payout",
        "Transfer rewards from protocol vault to user's token account",
        "Update user's claimed amount and reset unclaimed to zero",
        "Global PDA authority signs the reward transfer transaction",
      ],
      codeExample: `// Reward Claiming Process  
const claimInstruction = await program.methods
  .claimToken()
  .accounts({
    stake: stakePDA,
    global: globalPDA,
    user: user.publicKey,
    tokenMint: TOKEN_MINT,
    associatedGlobal: globalVaultAccount, 
    associatedUser: userTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .instruction();

// Vault Balance Check
require!(
  vault_balance >= claim_amount,
  StakingError::InsufficientVaultBalance
);

// Global Authority Transfer  
let global_signer_seeds: &[&[&[u8]]] = &[&[
  b"global",
  &[global_bump]
]];

transfer(
  CpiContext::new_with_signer(
    token_program,
    Transfer {
      from: global_vault,
      to: user_account,
      authority: global_pda, 
    },
    global_signer_seeds,
  ),
  claim_amount,
)?;`,
    },
  },

  {
    id: "admin-configuration",
    title: "Admin Configuration",
    icon: "Shield",
    content: {
      description:
        "How protocol parameters are managed by the admin, including emission rate adjustments and system initialization.",
      points: [
        "Only designated admin address can modify protocol parameters",
        "Set emission rate that determines daily reward distribution",
        "Initialize global state account for protocol-wide statistics",
        "Create and manage global token vault for reward payouts",
        "Emission rate validation ensures positive reward rates",
      ],
      codeExample: `// Admin Configuration
const ADMIN_PUBKEY = "BjjFpCbTrFVn3ZgcdCv4jTLAzbbDCMV1Vo115XJSJ7XG";

const setParamsInstruction = await program.methods
  .setParams(new BN(newEmissionRate))
  .accounts({
    global: globalPDA,
    admin: adminKeypair.publicKey, 
    tokenMint: TOKEN_MINT,
    associatedGlobal: globalVaultAccount,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .signers([adminKeypair])
  .instruction();

// Validation
require!(
  emission_rate > 0,
  StakingError::InvalidEmissionRate
);

// Global State Structure
#[account]
pub struct Global {
    pub amount: u64,        // Total tokens staked
    pub emission_rate: u64, // Tokens per day per unit staked
}`,
    },
  },

  {
    id: "technical-architecture",
    title: "Technical Implementation",
    icon: "Code",
    content: {
      description:
        "Deep dive into the smart contract architecture, account structures, and security mechanisms.",
      points: [
        "Built with Anchor framework for enhanced security and developer experience",
        "Program Derived Addresses (PDAs) ensure deterministic account creation",
        "Associated Token Accounts manage SPL token holdings securely",
        "Cross Program Invocation (CPI) for secure token transfers",
        "Comprehensive error handling and input validation throughout",
      ],
      codeExample: `// Account Structures
#[account]
#[derive(Debug, InitSpace)]
pub struct Global {
    pub amount: u64,        // Total staked in protocol
    pub emission_rate: u64, // Daily reward rate
}

#[account] 
#[derive(Debug, InitSpace)]
pub struct Stake {
    pub user: Pubkey,           // Stake owner
    pub amount: u64,            // Amount currently staked
    pub unclaimed_amount: u64,  // Pending rewards 
    pub claimed_amount: u64,    // Total rewards claimed
    pub updated_at: i64,        // Last update timestamp
}

// PDA Seeds
pub mod seeds {
    pub const GLOBAL_SEED: &[u8] = b"global";
    pub const STAKE_SEED: &[u8] = b"stake"; 
}

// Error Handling
#[error_code]
pub enum StakingError {
    #[msg("Invalid emission rate")]
    InvalidEmissionRate,
    #[msg("Invalid amount")] 
    InvalidAmount,
    #[msg("Insufficient vault balance")]
    InsufficientVaultBalance,
}`,
    },
  },
];

// Export for use in components
export default contentSections;
