const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();
const { API_URL_MAINNET, API_URL_GOERLI, PRIVATE_KEY_MAINNET, PRIVATE_KEY_GOERLI} = process.env;
const alchemyKey = API_URL_GOERLI;
const contractABI = require("../artifacts/contracts/Tester.sol/Tester.json");
const contractAddress = "0x3f20382394DcEf9361Cc5EBde314E4e618Ea77f1";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const signer = new ethers.Wallet(PRIVATE_KEY_GOERLI);
const ens = '0x12556';

describe("Tester", function () {

  it("Should Print Unicode", async function () {

    const owner = await ethers.getSigner(signer.address);
    const tester = await ethers.getContractFactory("Tester", owner);
    const contract = tester.attach(contractAddress);
    const convert = await contract.convert(ens, {
        gasLimit: 100000,
    });
    const contractReceipt = await convert.wait();
    const event = contractReceipt.events?.find(event => event.event === 'Print')
    console.log(event.args[0]);
  });
});
