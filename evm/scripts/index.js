const hardhat = require("hardhat");

async function main() {
  const IndexIt = await hardhat.ethers.getContractFactory("IndexIt");
  const indexIt = await IndexIt.deploy();
  await indexIt.deployed();
  console.log("IndexIt is deployed to:", indexIt.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
