const anchor = require("@project-serum/anchor");
const { SystemProgram } = require("@solana/web3.js");

// console.log("ANCHOR ====>", anchor);
const main = async () => {
  console.log("🚀 Starting test...");
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Mytestproject;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();
  // console.log("**BaseAccount ===>**", baseAccount);

  const tx = await program.rpc.initialize({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF Count", account.totalGifs.toString());

  await program.rpc.addGif(
    "https://media.giphy.com/media/yoJC2GnSClbPOkV0eA/giphy.gif",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log("👀 GIF Count", account.totalGifs.toString(), account);

  // Access gif_list on the account!
  console.log("👀 GIF List", account.gifList);

  await program.rpc.upvotes(
    "https://media.giphy.com/media/yoJC2GnSClbPOkV0eA/giphy.gif",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log("👀 GIF Count", account.likes, account);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();

// describe('mytestproject', () => {

//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.Provider.env());

//   it('Is initialized!', async () => {
//     // Add your test here.
//     const program = anchor.workspace.Mytestproject;
//     const tx = await program.rpc.initialize();
//     console.log("Your transaction signature", tx);
//   });
// });
