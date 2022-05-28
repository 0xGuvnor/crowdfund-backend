const { ethers } = require("hardhat");

async function main() {
  const Factory = await ethers.getContractFactory("CrowdfundFactory");
  const factory = await Factory.deploy();
  await factory.deployed();

  console.log(`Factory deployed @ "${factory.address}"`);

  await factory.createCrowdfund(ethers.utils.parseEther("0.01"));
  const [myCrowdfund] = await factory.getDeployedCrowdfunds();

  console.log(`Crowdfund instance deployed @ "${myCrowdfund}"`);
}

// Error handling pattern
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});