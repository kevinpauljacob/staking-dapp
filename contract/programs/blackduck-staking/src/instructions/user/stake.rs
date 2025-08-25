use crate::{
    constants::{seeds, TOKEN_PUBKEY},
    error::StakingError,
    state::{Global, Stake},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
pub struct StakeToken<'info> {
    #[account(
        init_if_needed,
        seeds = [seeds::STAKE_SEED, user.key().as_ref()],
        payer = user,
        space = 8 + Stake::INIT_SPACE,
        bump,
    )]
    pub stake: Box<Account<'info, Stake>>,
    #[account(
        mut,
        seeds = [seeds::GLOBAL_SEED],
        bump,
    )]
    pub global: Box<Account<'info, Global>>,
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(address = TOKEN_PUBKEY)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = stake,
    )]
    pub associated_stake: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
    )]
    pub associated_user: Box<Account<'info, TokenAccount>>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn stake_token_handler(ctx:Context<StakeToken>, amount: u64) -> Result<()> {
 require!(amount > 0, StakingError::InvalidAmount);

 let stake: &mut Box<Account<'_,Stake>> = &mut ctx.accounts.stake;
 let global: &mut Box<Account<'_ , Global>> = &mut ctx.accounts.global;
 let user: Pubkey = ctx.accounts.user.key();

 stake.user = user;

 stake.update_unclaimed_amount(global,ctx.accounts.token_mint.decimals)?;

let user_balance:u64 = ctx.accounts.associated_user.amount;
let stake_amount: u64 = amount.min(user_balance);


transfer(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.associated_user.to_account_info(),
            to: ctx.accounts.associated_stake.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    ),
    stake_amount,
)?;
    stake.amount += stake_amount;
    global.amount += stake_amount;

Ok(())
}