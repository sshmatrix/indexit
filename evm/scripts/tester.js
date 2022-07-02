const hardhat = require("hardhat");
require('dotenv').config();
const { API_URL_MAINNET, API_URL_GOERLI, PRIVATE_KEY_MAINNET, PRIVATE_KEY_GOERLI} = process.env;
const signer = new ethers.Wallet(PRIVATE_KEY_GOERLI);

async function main() {
  const Tester = await hardhat.ethers.getContractFactory("Tester");
  const owner = await ethers.getSigner(signer.address);
  const tester = await Tester.connect(owner).deploy();
  await tester.deployed();
  console.log("Tester is deployed to:", tester.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
