const { expect } = require("chai");
const { ethers } = require("hardhat");

require('dotenv').config();
const alchemyKey = process.env.API_URL;
const contractABI = require("../artifacts/contracts/IndexIt.sol/IndexIt.json");
const contractAddress = "0x709B40d05e32F3900eba40577732Df96F3Fc082f";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

const ens = '013';
const timestamp = Date.now();
let message = `Hello IndexIt.eth at time ${timestamp}`;
let someHash = ethers.utils.id(message);;
let payload = ethers.utils.defaultAbiCoder.encode([ "bytes32", "string" ], [ someHash, message ]);
let messageHash = ethers.utils.keccak256(payload);
let messageBytes = ethers.utils.arrayify(messageHash);
const signature = signer.signMessage(messageBytes);
const tokenURI = signature;
console.log(someHash);
console.log(messageHash);
console.log(message);
console.log(signature);
describe("IndexIt", function () {
  it("Signer & Minter should match", async function () {
    const indexIt = await ethers.getContractFactory("IndexIt");
    const contract = indexIt.attach(contractAddress);
    const response = await contract.mintToken(someHash, message, signature, tokenURI, ens);
    const receipt = await response.wait();
    const [value] = receipt.events;
    console.log(value);
  });
});
