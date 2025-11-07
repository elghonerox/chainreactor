const hre = require("hardhat");

async function main() {
  // ⚠️ REPLACE WITH YOUR ACTUAL ADDRESSES
  const KWALA_WALLET = "0x6eb6ee4044d2fac6b56c100942d4e5254112dfb5";
  
  const contracts = {
    polygon: {
      address: process.env.POLYGON_QUEST_CONTRACT,
      name: "QuestContract"
    },
    ethereum: {
      address: process.env.ETHEREUM_ACHIEVEMENT_NFT,
      name: "AchievementNFT"
    },
    bnb: {
      address: process.env.BNB_REWARD_TOKEN,
      name: "RewardToken"
    },
    arbitrum: {
      address: process.env.ARBITRUM_BADGE_TRACKER,
      name: "BadgeTracker"
    }
  };

  console.log(`\n🔄 Transferring ownership to Kwala wallet: ${KWALA_WALLET}\n`);

  // Transfer Polygon contract
  console.log("1. Transferring QuestContract on Polygon...");
  const questContract = await hre.ethers.getContractAt(
    "QuestContract", 
    contracts.polygon.address
  );
  const tx1 = await questContract.transferOwnership(KWALA_WALLET);
  await tx1.wait();
  console.log("   ✅ Polygon ownership transferred");

  // You'll run this script on each network separately (see below)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
