use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use anchor_lang::solana_program::pubkey;

declare_id!("71SzaqeYfGgPp6X6ajhZzvUwDCd1R8GxYrkHchwrBoUp");

// Hardcoded Government Official Key for MVP (Replace with real key in production)
// For local testing, we might need to swap this.
pub const GOV_KEY: Pubkey = pubkey!("73yGGVeAJuKQ5Z66vV6YbzZDXqL7yuC6mEw3WTC5Dcno"); 
pub const PEOPLE_KEY_1: Pubkey = pubkey!("Dg9k48gNJMaqv4E5Hs3jSY8fhKkLw4H5X8AUVA2rn3Y4");
pub const PEOPLE_KEY_2: Pubkey = pubkey!("6F994z3DQsvhwnNDxDE6ZE6Kr6UWpKs7DkZ3WmGbrAhb");

#[program]
pub mod land_registry {
    use super::*;

    pub fn register_land(
        ctx: Context<RegisterLand>, 
        land_id: u64, 
        location: String, 
        area: String
    ) -> Result<()> {
        // SECURITY FIX: Only allow government or designated people to register land
        msg!("Signer: {:?}", ctx.accounts.owner.key());
        
        let signer = ctx.accounts.owner.key();
        require!(
            signer == GOV_KEY || signer == PEOPLE_KEY_1 || signer == PEOPLE_KEY_2, 
            CustomError::Unauthorized
        );

        // EDGE CASE: String length validation
        require!(location.len() <= 200, CustomError::StringTooLong);
        require!(area.len() <= 50, CustomError::StringTooLong);

        let land = &mut ctx.accounts.land;
        land.id = land_id;
        land.location = location;
        land.area = area;
        land.owner = ctx.accounts.owner.key();
        land.is_verified = true; // Initially verified by gov official
        land.transfer_count = 0;
        Ok(())
    }

    pub fn initiate_transfer(ctx: Context<InitiateTransfer>, buyer: Pubkey) -> Result<()> {
        let land = &mut ctx.accounts.land;
        let transfer_request = &mut ctx.accounts.transfer_request;

        require!(ctx.accounts.owner.key() == land.owner, CustomError::Unauthorized);
        
        // EDGE CASE: Prevent self-transfer
        require!(buyer != land.owner, CustomError::SelfTransfer);

        transfer_request.id = land.transfer_count;
        transfer_request.land_id = land.id;
        transfer_request.seller = land.owner;
        transfer_request.buyer = buyer;
        transfer_request.status = TransferStatus::Pending;
        transfer_request.is_buyer_approved = false;
        transfer_request.is_gov_approved = false;
        
        // EDGE CASE: Use checked arithmetic
        land.transfer_count = land.transfer_count.checked_add(1).ok_or(CustomError::Overflow)?;
        
        Ok(())
    }

    pub fn approve_transfer(ctx: Context<ApproveTransfer>) -> Result<()> {
        let transfer_request = &mut ctx.accounts.transfer_request;
        let land = &mut ctx.accounts.land;
        let signer = &ctx.accounts.signer;

        require!(transfer_request.status == TransferStatus::Pending, CustomError::RequestNotPending);

        // Check who is signing
        if signer.key() == transfer_request.buyer {
            transfer_request.is_buyer_approved = true;
        } else if signer.key() == GOV_KEY || signer.key() == PEOPLE_KEY_1 || signer.key() == PEOPLE_KEY_2 { // logic for Gov/People
             transfer_request.is_gov_approved = true;
        } else {
             return err!(CustomError::UnauthorizedSigner);
        }

        // execute transfer if all approved
        if transfer_request.is_buyer_approved && transfer_request.is_gov_approved {
            land.owner = transfer_request.buyer;
            transfer_request.status = TransferStatus::Completed;
            
            // Emit Transfer Event
            let clock = Clock::get()?;
            emit!(TransferEvent {
                land_id: land.id,
                from: transfer_request.seller, // Use request seller as it's the original owner
                to: transfer_request.buyer,
                timestamp: clock.unix_timestamp,
                transfer_count: land.transfer_count, // Or request id? User asked for land transfer count.
            });
        }

        Ok(())
    }

    pub fn cancel_transfer(ctx: Context<CancelTransfer>) -> Result<()> {
        let transfer_request = &mut ctx.accounts.transfer_request;
        let signer = &ctx.accounts.signer;

        require!(transfer_request.status == TransferStatus::Pending, CustomError::RequestNotPending);
        
        // Only seller can cancel
        require!(signer.key() == transfer_request.seller, CustomError::Unauthorized);

        transfer_request.status = TransferStatus::Rejected;
        
        Ok(())
    }
}

#[event]
pub struct TransferEvent {
    pub land_id: u64,
    pub from: Pubkey,
    pub to: Pubkey,
    pub timestamp: i64,
    pub transfer_count: u64,
}

#[account]
pub struct Land {
    pub id: u64,
    pub location: String,
    pub area: String,
    pub owner: Pubkey,
    pub is_verified: bool,
    pub transfer_count: u64,
}

#[account]
pub struct TransferRequest {
    pub id: u64,
    pub land_id: u64,
    pub seller: Pubkey,
    pub buyer: Pubkey,
    pub status: TransferStatus,
    pub is_buyer_approved: bool,
    pub is_gov_approved: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TransferStatus {
    Pending,
    Completed,
    Rejected,
}

#[derive(Accounts)]
#[instruction(land_id: u64)]
pub struct RegisterLand<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 8 + 200 + 50 + 32 + 1 + 8, // Added space for transfer_count
        seeds = [b"land".as_ref(), land_id.to_le_bytes().as_ref()],
        bump
    )]
    pub land: Account<'info, Land>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitiateTransfer<'info> {
    #[account(mut, has_one = owner)]
    pub land: Account<'info, Land>,
    #[account(
        init,
        payer = owner,
        space = 8 + 8 + 8 + 32 + 32 + 2 + 2,
        seeds = [b"transfer".as_ref(), land.key().as_ref(), land.transfer_count.to_le_bytes().as_ref()],
        bump
    )]
    pub transfer_request: Account<'info, TransferRequest>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveTransfer<'info> {
    #[account(mut)]
    pub transfer_request: Account<'info, TransferRequest>,
    #[account(mut, constraint = land.id == transfer_request.land_id @ CustomError::InvalidLandAccount)]
    pub land: Account<'info, Land>, 
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelTransfer<'info> {
    #[account(mut)]
    pub transfer_request: Account<'info, TransferRequest>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Request is not pending")]
    RequestNotPending,
    #[msg("Unauthorized signer")]
    UnauthorizedSigner,
    #[msg("Invalid Land Account")]
    InvalidLandAccount,
    #[msg("Cannot transfer land to yourself")]
    SelfTransfer,
    #[msg("String exceeds maximum length")]
    StringTooLong,
    #[msg("Arithmetic overflow")]
    Overflow,
}
