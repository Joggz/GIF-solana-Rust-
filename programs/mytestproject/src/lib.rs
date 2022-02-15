use anchor_lang::prelude::*;


declare_id!("CvhXZkJxLzQ8YWgak9qYcDqDRjaUBTXF6HSfGcsLw9nZ");

#[program]
pub mod mytestproject {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {

        let base_account = &mut ctx.accounts.base_account;
        base_account.total_gifs = 0;
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;
        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
            likes: 0,
        };
        base_account.gifs_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    pub fn upvotes(ctx: Context<AddGif>, filter: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        for element in &mut base_account.gifs_list {
            if filter.to_string() == element.gif_link {
                element.likes += 1;            }
        }
       
  
      Ok(())
    
    }}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub likes: u64,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gifs_list: Vec<ItemStruct>,
}


