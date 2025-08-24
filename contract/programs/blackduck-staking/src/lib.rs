use anchor_lang::prelude::*;
use instructions::{
    admin::set_params::*,
};

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("8kj6DQhqymcXMbMxtU6SzDZJwa3W9LrFf1ePvbM4bu2L");

#[program]
pub mod staking {
    use super::*;

    // Admin instructions

    pub fn set_params(ctx: Context<SetParams>, emission_rate: u64) -> Result<()> {
        set_params_handler(ctx, emission_rate)
    }
}
