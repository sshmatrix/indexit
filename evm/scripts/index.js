const hardhat = require("hardhat");
require('dotenv').config();
const { API_URL_MAINNET, API_URL_GOERLI, PRIVATE_KEY_MAINNET, PRIVATE_KEY_GOERLI} = process.env;
const signer = new ethers.Wallet(PRIVATE_KEY_GOERLI);

async function main() {
  const IndexIt = await hardhat.ethers.getContractFactory("IndexIt");
  const owner = await ethers.getSigner(signer.address);
  const indexIt = await IndexIt.connect(owner).deploy();
  await indexIt.deployed();
  console.log("IndexIt is deployed to:", indexIt.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
