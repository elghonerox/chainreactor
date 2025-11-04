const hre = require("hardhat");

async function main() {
  console.log("Deploying RewardToken to BNB Testnet...");

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();

  await rewardToken.waitForDeployment();
  const address = await rewardToken.getAddress();

  console.log("RewardToken deployed to:", address);
  console.log("Waiting for block confirmations...");

  await rewardToken.deploymentTransaction().wait(5);

  console.log("Verifying contract on BscScan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }

  // Check initial supply
  const contractBalance = await rewardToken.contractBalance();
  console.log("\nContract token balance:", hre.ethers.formatEther(contractBalance), "CRRT");

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Save this address to your .env file:");
  console.log(`BNB_REWARD_TOKEN=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });