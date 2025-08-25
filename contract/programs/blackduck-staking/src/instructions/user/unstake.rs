use crate::{
    constants::{seeds,TOKEN_PUBKEY},
    error::StakingError,
    state::{Global, Stake},
};
use anchor_lang::{prelude::*, solana_program::stable_layout};
use anchor_spl::token::{transfer, Mint,Token,TokenAccount,Transfer};

#[derive(Accounts)]
pub 
struct UnstakeToken<'info>{
    #[account(
        mut,
        seeds = [seeds::STAKE_SEED, user.key().as_ref()],
        bump,
    )]
    pub stake: Box<Account<'info,Stake>>,
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
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = stake,
    )]
    pub associated_stake: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user
    )]
    pub associated_user: Box<Account<'info, TokenAccount>>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn unstake_token_handler(ctx:Context<UnstakeToken>, amount:u64) -> Result<()>{
    let stake: &mut Box<Account<'_, Stake>> = &mut ctx.accounts.stake;
    let global: &mut Box<Account<'_ , Global>> = &mut ctx.accounts.global;

    let unstake_amount: u64 = stake.amount.min(amount);
    require!(unstake_amount > 0, StakingError::InvalidAmount);

    let user: Pubkey = ctx.accounts.user.key();
    let signer_seeds: &[&[&[u8]]] = &[&[seeds::STAKE_SEED, user.as_ref(), &[ctx.bumps.stake]]];

    stake.update_unclaimed_amount(global, ctx.accounts.token_mint.decimals)?;

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.associated_stake.to_account_info(),
                to: ctx.accounts.associated_user.to_account_info(),
                authority: stake.to_account_info()
            },
            signer_seeds,
        ),
        unstake_amount,
    )?;

    stake.amount -= unstake_amount;
    global.amount -= unstake_amount;

    Ok(())

}