use anchor_lang::prelude::*;

#[error_code]
pub enum StakingError {
    #[msg("Invalid emission rate")]
    InvalidEmissionRate,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient vault balance")]
    InsufficientVaultBalance,
}
