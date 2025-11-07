const hre = require("hardhat");

async function main() {
  const KWALA_WALLET = "0x6eb6ee4044d2fac6b56c100942d4e5254112dfb5";
  
  console.log("\n🔄 Transferring AchievementNFT ownership to Kwala...");
  
  const achievementNFT = await hre.ethers.getContractAt(
    "AchievementNFT",
    process.env.ETHEREUM_ACHIEVEMENT_NFT
  );
  
  const tx = await achievementNFT.transferOwnership(KWALA_WALLET);
  await tx.wait();
  
  console.log("✅ Ethereum ownership transferred");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
