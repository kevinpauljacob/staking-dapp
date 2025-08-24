use anchor_lang::prelude::*;

#[account]
#[derive(Debug, InitSpace)]
pub struct Global {
    pub amount: u64,
    pub emission_rate: u64, // Emission rate in tokens * (10 ^ decimals) per day per token staked
}
