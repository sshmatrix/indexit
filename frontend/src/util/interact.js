//import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractAddress = '0x2c42E63cAC62E1122B1FCacc6b8cF3A4Cd7d7Bcd';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Enter ENS & click 'NEXT →'",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      console.log("❌ Failed to initialise: " + err.message);
      return {
        address: "",
        status: "❌ Failed to initialise: " + err.message.toLowerCase(),
      };
    }
  } else {
    return {
      address: "",
      status: "🦊 You must install MetaMask browser extension & connect using 'Connect Wallet' button",
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Enter ENS & click 'NEXT →'",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to MetaMask using 'Connect Wallet' button",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "❌ " + err.message.toLowerCase(),
      };
    }
  } else {
    return {
      address: "",
      status: "🦊 You must install MetaMask browser extension & connect using 'Connect Wallet' button",
    };
  }
};

// async function loadContract() {
//  return new web3.eth.Contract(contractABI, contractAddress);
// }

export const mintNFT = async (url, name, message, signature, messageHash) => {
  if (url.trim() === "" || name.trim() === "" || message.trim() === "" || signature.trim() === "" || messageHash.trim() === "") {
    window.alert('❗ Metadata is incomplete.');
    return {
      success: false,
      status: "❗ Metadata is incomplete.",
    };
  } else {
    console.log('⌛ Pinning Metadata... Please wait!');
    await fetch(`https://indexit.club/public/cards/${signature}/${signature}.json`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.signature === signature) {
          console.log('📎 Metadata pinned! ⌛ Minting Card... Please wait!');
        } else {
          window.alert('❌ Something went wrong while uploading your tokenURI. Signature appears tampered! ❗');
          return {
            success: false,
            status: "❌ Something went wrong while uploading your tokenURI. Signature appears tampered! ❗",
          };
        }
      });
    const tokenURI = url;
    window.contract = await new web3.eth.Contract(contractABI.abi, contractAddress);
    const transactionParameters = {
      to: contractAddress,
      from: window.ethereum.selectedAddress,
      data: window.contract.methods
        .mintToken(messageHash, message, signature, tokenURI, name)
        .encodeABI(),
      value: '1',
      chainID: '1',
      gasLimit: '360000',
    };

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      console.log(txHash);
      return {
        success: true,
        status: "🚀 Transaction sent! ✅✅✅",
      };
    } catch (error) {
      return {
        success: false,
        status: "❌ Something went wrong: " + error.message.toLowerCase(),
      };
    }
  }
};
