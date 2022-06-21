const { expect } = require("chai");
const { ethers } = require("hardhat");

require('dotenv').config();
const alchemyKey = process.env.API_URL;
const contractABI = require("../artifacts/contracts/IndexIt.sol/IndexIt.json");
const contractAddress = "0x2c42E63cAC62E1122B1FCacc6b8cF3A4Cd7d7Bcd";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

const ens = '00131';
const timestamp = Date.now();
let message = `Signed by ${signer.address} at time ${timestamp}`;
let someHash = ethers.utils.id(message);;
let payload = ethers.utils.defaultAbiCoder.encode([ "bytes32", "string" ], [ someHash, message ]);
let messageHash = ethers.utils.keccak256(payload);
let messageBytes = ethers.utils.arrayify(messageHash);
const signature = signer.signMessage(messageBytes);
const tokenURI = signature;

describe("IndexIt", function () {
  it("Signer & Minter should match", async function () {
    const indexIt = await ethers.getContractFactory("IndexIt");
    const contract = indexIt.attach(contractAddress);
    const gasEstimated = await contract.estimateGas.mintToken(someHash, message, signature, tokenURI, ens);
    const response = await contract.mintToken(someHash, message, signature, tokenURI, ens);
    const receipt = await response.wait();
    const value2 = receipt.events[0].args;
    console.log(value2);
  });
});
