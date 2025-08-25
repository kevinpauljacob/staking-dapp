use anchor_lang::prelude::*;
use crate::{
    error::StakingError,
};
#[account]
#[derive(Debug, InitSpace)]
pub struct Global {
    pub amount: u64,
    pub emission_rate: u64, // Emission rate in tokens * (10 ^ decimals) per day per token staked
}

#[account]
#[derive(Debug, InitSpace)]
pub struct Stake {
    pub user : Pubkey,
    pub amount: u64,
    pub unclaimed_amount: u64,
    pub claimed_amount: u64,
    pub updated_at: i64,
}

impl Stake {
    pub fn update_unclaimed_amount(
        &mut self,
        global: &Global,
        decimals: u8,
    ) -> Result<()> {
        let curr_time = Clock::get()?.unix_timestamp as u128;
        let staked_duration = curr_time
            .checked_sub(self.updated_at as u128)
            .ok_or(StakingError::MathError)?;

        const SCALE: u128 = 1_000_000;
        let rate = global.emission_rate as u128;
        let amount = self.amount as u128;
        let token_units = 10u128.pow(decimals as u32);

        // Multiply numerator step by step, mapping None -> Err
        let num1 = amount.checked_mul(rate).ok_or(StakingError::MathError)?;
        let num2 = num1.checked_mul(staked_duration).ok_or(StakingError::MathError)?;
        let num3 = num2.checked_mul(SCALE).ok_or(StakingError::MathError)?;

        // Denominator
        let den1 = token_units
            .checked_mul(86_400u128)
            .ok_or(StakingError::MathError)?;

        // Compute final unclaimed
        let newly_unclaimed = num3
            .checked_div(den1)
            .ok_or(StakingError::MathError)?;

        self.unclaimed_amount = self
            .unclaimed_amount
            .checked_add(newly_unclaimed as u64)
            .ok_or(StakingError::MathError)?;

        self.updated_at = curr_time as i64;
        Ok(())
    }
}
