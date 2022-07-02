const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();
const { API_URL_MAINNET, API_URL_GOERLI, PRIVATE_KEY_MAINNET, PRIVATE_KEY_GOERLI} = process.env;
const alchemyKey = API_URL_GOERLI;
const contractABI = require("../artifacts/contracts/IndexIt.sol/IndexIt.json");
const contractAddress = "0x185b5269AFeC155259260B369AC4f457d10e8EC7";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const signer = new ethers.Wallet(PRIVATE_KEY_GOERLI);
const ens = '556';
const timestamp = Date.now();
let message = `Signed by ${signer.address} at time ${timestamp}`;
let someHash = ethers.utils.id(message);;
let payload = ethers.utils.defaultAbiCoder.encode([ "bytes32", "string" ], [ someHash, message ]);
let messageHash = ethers.utils.keccak256(payload);
let messageBytes = ethers.utils.arrayify(messageHash);
const signature = signer.signMessage(messageBytes);
const tokenURI = 'https://indexit.club/public/cards/0x99999/a290f5fede2e.json';

describe("IndexIt", function () {

  it("Signer, Minter & Owner should match", async function () {
    const owner = await ethers.getSigner(signer.address);
    const indexIt = await ethers.getContractFactory("IndexIt", owner);
    const contract = indexIt.attach(contractAddress);

    const gasEstimated = await contract.estimateGas.mintToken(someHash, message, signature, tokenURI, ens,
      {
          gasLimit: 175000,
          value: ethers.utils.parseEther("0.05") // Cost of the operation is 0.05 ETH
      });
    console.log('Estimated Gas: ' + gasEstimated);
    // gas ~ 300,000
    const mint = await contract.mintToken(someHash, message, signature, tokenURI, ens,
      {
          gasLimit: 175000,
          value: ethers.utils.parseEther("0.05") // Cost of the operation is 0.05 ETH
      });
    const receipt = await mint.wait();
  });


  it("Should withdraw", async function () {
    const owner = await ethers.getSigner(signer.address);
    const indexIt = await ethers.getContractFactory("IndexIt");
    const contract = indexIt.attach(contractAddress);

    const gasEstimated = await contract.estimateGas.withdraw(
      {
          gasLimit: 35000
      });
    console.log('Estimated Gas: ' + gasEstimated);
    // gas ~ 25,000

    const withdraw = await contract.withdraw(
      {
          gasLimit: 35000
      });
    const wagmi = await withdraw.wait();
  });

});
