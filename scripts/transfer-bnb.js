const hre = require("hardhat");

async function main() {
  const KWALA_WALLET = "0x6eb6ee4044d2fac6b56c100942d4e5254112dfb5";
  
  console.log("\n🔄 Transferring RewardToken ownership to Kwala...");
  
  const rewardToken = await hre.ethers.getContractAt(
    "RewardToken",
    process.env.BNB_REWARD_TOKEN
  );
  
  const tx = await rewardToken.transferOwnership(KWALA_WALLET);
  await tx.wait();
  
  console.log("✅ BNB ownership transferred");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
