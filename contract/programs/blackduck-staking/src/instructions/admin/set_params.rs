use crate::{
    constants::{seeds, ADMIN_PUBKEY, TOKEN_PUBKEY},
    error::StakingError,
    state::Global,
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct SetParams<'info> {
    #[account(
        init_if_needed,
        seeds = [seeds::GLOBAL_SEED],
        payer = admin,
        space = 8 + Global::INIT_SPACE,
        bump,
    )]
    pub global: Box<Account<'info, Global>>,
    #[account(
        mut,
        address = ADMIN_PUBKEY,
    )]
    pub admin: Signer<'info>,

    #[account(address = TOKEN_PUBKEY)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = admin,
        associated_token::mint = token_mint,
        associated_token::authority = global,
    )]
    pub associated_global: Box<Account<'info, TokenAccount>>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn set_params_handler(ctx: Context<SetParams>, emission_rate: u64) -> Result<()> {
    require!(
        emission_rate > 0,
        StakingError::InvalidEmissionRate
    );

    let global = &mut ctx.accounts.global;
    global.emission_rate = emission_rate;

    Ok(())
}
