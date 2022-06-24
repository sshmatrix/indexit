const { expect } = require("chai");
const { ethers } = require("hardhat");

require('dotenv').config();
const alchemyKey = process.env.API_URL;
const contractABI = require("../artifacts/contracts/IndexIt.sol/IndexIt.json");
const contractAddress = "0xe24B85ECfAd328d0347BEe0DF92aF499f842146C";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
console.log(signer.address)
const ens = '448';
const timestamp = Date.now();
let message = `Signed by ${signer.address} at time ${timestamp}`;
let someHash = ethers.utils.id(message);;
let payload = ethers.utils.defaultAbiCoder.encode([ "bytes32", "string" ], [ someHash, message ]);
let messageHash = ethers.utils.keccak256(payload);
let messageBytes = ethers.utils.arrayify(messageHash);
const signature = signer.signMessage(messageBytes);
const tokenURI = signature;
console.log(ethers.utils.parseEther("0.01"));
describe("IndexIt", function () {
  it("Signer, Minter & Owner should match", async function () {
    const indexIt = await ethers.getContractFactory("IndexIt");
    const contract = indexIt.attach(contractAddress);
    // const gasEstimated = await contract.estimateGas.mintToken(someHash, message, signature, tokenURI, ens);
    const response = await contract.mintToken(someHash, message, signature, tokenURI, ens,
      {
          gasLimit: 500000,
          value: ethers.utils.parseEther("0.002") // Cost of the operation is 0.01 ETH
      });
    const receipt = await response.wait();
    const value2 = receipt.events[0].args;
    console.log(value2);
  });
});
