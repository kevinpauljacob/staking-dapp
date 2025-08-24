use anchor_lang::{constant, prelude::Pubkey, pubkey};

pub const ADMIN_PUBKEY: Pubkey = pubkey!("BjjFpCbTrFVn3ZgcdCv4jTLAzbbDCMV1Vo115XJSJ7XG");
#[constant]
pub const TOKEN_PUBKEY: Pubkey = pubkey!("7pbveBNXKsHVq88fAxjkWaDpKR5nm5K978extidmUEFX");

pub mod seeds {
    pub const GLOBAL_SEED: &[u8] = b"global";
    pub const STAKE_SEED: &[u8] = b"stake";
}
