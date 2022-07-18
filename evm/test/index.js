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
const ensArabic = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
const ensHindi = "\u0966\u0967\u0968\u0969\u096a\u096b\u096c\u096d\u096e\u096f";
const ensKorean = "\ud558\ub098\ub458\uc14b\ub137\ub2e4\uc12f\uc5ec\uc12f\uc77c\uacf1\uc5ec\ub35f\uc544\ud649\uc5f4";
const ensChinese = "\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341";

describe("Tester", function () {

  it("Should Print Unicode", async function () {

    const owner = await ethers.getSigner(signer.address);
    const tester = await ethers.getContractFactory("Tester", owner);
    const contract = tester.attach(contractAddress);
    const convert = await contract.convert(ensChinese, {
        gasLimit: 100000,
    });
    const contractReceipt = await convert.wait();
    const event = contractReceipt.events?.find(event => event.event === 'Print')
    console.log(event.args[0]);
  });
});
