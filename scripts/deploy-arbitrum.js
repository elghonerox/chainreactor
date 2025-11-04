const hre = require("hardhat");

async function main() {
  console.log("Deploying BadgeTracker to Arbitrum Sepolia...");

  const BadgeTracker = await hre.ethers.getContractFactory("BadgeTracker");
  const badgeTracker = await BadgeTracker.deploy();

  await badgeTracker.waitForDeployment();
  const address = await badgeTracker.getAddress();

  console.log("BadgeTracker deployed to:", address);
  console.log("Waiting for block confirmations...");

  await badgeTracker.deploymentTransaction().wait(5);

  console.log("Verifying contract on Arbiscan...");
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
  console.log(`ARBITRUM_BADGE_TRACKER=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });