const hre = require("hardhat");

async function main() {
  console.log("Deploying AchievementNFT to Ethereum Sepolia...");

  const AchievementNFT = await hre.ethers.getContractFactory("AchievementNFT");
  const achievementNFT = await AchievementNFT.deploy();

  await achievementNFT.waitForDeployment();
  const address = await achievementNFT.getAddress();

  console.log("AchievementNFT deployed to:", address);
  console.log("Waiting for block confirmations...");

  await achievementNFT.deploymentTransaction().wait(5);

  console.log("Verifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Save this address to your .env file:");
  console.log(`ETHEREUM_ACHIEVEMENT_NFT=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });