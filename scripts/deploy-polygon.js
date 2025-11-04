const hre = require("hardhat");

async function main() {
  console.log("Deploying QuestContract to Polygon Amoy...");

  const QuestContract = await hre.ethers.getContractFactory("QuestContract");
  const questContract = await QuestContract.deploy();

  await questContract.waitForDeployment();
  const address = await questContract.getAddress();

  console.log("QuestContract deployed to:", address);
  console.log("Waiting for block confirmations...");

  // Wait for 5 block confirmations
  await questContract.deploymentTransaction().wait(5);

  console.log("Verifying contract on PolygonScan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }

  // Create initial quests
  console.log("\nCreating initial quests...");
  const tx = await questContract.createQuest("Complete Tutorial", 50);
  await tx.wait();
  console.log("Initial quests created");

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Save this address to your .env file:");
  console.log(`POLYGON_QUEST_CONTRACT=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  