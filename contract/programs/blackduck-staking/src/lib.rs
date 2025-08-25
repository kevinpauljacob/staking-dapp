use anchor_lang::prelude::*;
use instructions::{
    admin::set_params::*,
    user::{claim::*, stake::*, unstake::*},
};

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("6WXe3mg5xmhyep5ZA91AyByZ9zFitjBiJJc8Pxf86vsV");

#[program]
pub mod staking {
    use super::*;

    // Admin instructions

    pub fn set_params(ctx: Context<SetParams>, emission_rate: u64) -> Result<()> {
        set_params_handler(ctx, emission_rate)
    }

    pub fn stake_token(ctx: Context<StakeToken>, amount: u64) -> Result<()> {
        stake_token_handler(ctx, amount)
    }

    pub fn unstake_token(ctx: Context<UnstakeToken>, amount: u64) -> Result<()> {
        unstake_token_handler(ctx, amount)
    }

    pub fn claim_token(ctx: Context<ClaimToken>) -> Result<()> {
        claim_token_handler(ctx)
    }
}
