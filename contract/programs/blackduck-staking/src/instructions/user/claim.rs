use crate::{
    constants::{seeds, TOKEN_PUBKEY},
    error::StakingError,
    state::{Global, Stake},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Mint, Token, TokenAccount, Transfer};


#[derive(Accounts)]
pub struct ClaimToken<'info> {
    #[account(
        mut,
        seeds =[seeds::STAKE_SEED, user.key().as_ref()],
        bump,
    )]
    pub stake: Box<Account<'info, Stake>>,
    #[account(
        seeds = [seeds::GLOBAL_SEED],
        bump,
    )]
    pub global: Box<Account<'info, Global>>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(address = TOKEN_PUBKEY)]
    pub token_mint: Box<Account<'info, Mint>>,
 #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = global,
    )]
    pub associated_global: Box<Account<'info, TokenAccount>>,
    #[account(mut,
    associated_token::mint = token_mint,
    associated_token::authority= global,
    )]
    pub associated_user : Box<Account<'info, TokenAccount>>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn claim_token_handler(ctx:Context<ClaimToken>) -> Result<()>{
    let stake: &mut Box<Account<'_, Stake>> = &mut ctx.accounts.stake;
    let global: &mut Box<Account<'_,Global>> = &mut ctx.accounts.global;

    let signer_seeds: &[&[&[u8]]] = &[&[seeds::GLOBAL_SEED, &[ctx.bumps.global]]];

    stake.update_unclaimed_amount(global, ctx.accounts.token_mint.decimals)?;

    let claim_amount: u64 = stake.unclaimed_amount;
    require!(claim_amount > 0, StakingError::InvalidAmount);

    require!(
        ctx.accounts.associated_global.amount >= claim_amount,
        StakingError::InsufficientVaultBalance
    );

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.associated_global.to_account_info(),
                to: ctx.accounts.associated_user.to_account_info(),
                authority: global.to_account_info(),
            },
            signer_seeds,
        ),
        claim_amount,
    )?;

    stake.claimed_amount += claim_amount;
    stake.unclaimed_amount -= claim_amount;

    Ok(())
}