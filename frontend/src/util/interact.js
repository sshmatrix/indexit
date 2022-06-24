import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyURL = process.env.REACT_APP_ALCHEMY_URL_GOERLI;
const contractABI = require("../contract-abi.json");
const contractAddress = '0xe24B85ECfAd328d0347BEe0DF92aF499f842146C';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyURL);

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

async function getJSON(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

export const mintNFT = async (url, name, message, signature, messageHash) => {
  if (url.trim() === "" || name.trim() === "" || message.trim() === "" || signature.trim() === "" || messageHash.trim() === "") {
    window.alert('❗ Metadata is incomplete.');
    return {
      success: false,
      status: "❗ Metadata is incomplete.",
    };
  } else {
    console.log('⌛ Pinning metadata to IPFS & Minting!');
    const jsonData = await getJSON(url)
    // console.log(jsonData);
    let tokenURI = url;

    if (jsonData.signature === signature) {
      if (!url) {
        window.alert('❌ Metadata URI missing ❗');
        return {
          success: false,
          status: "❌ Metadata URI missing ❗",
        };
      } else {
        const pinataResponse = await pinJSONToIPFS(jsonData);
        if (!pinataResponse.success) {
          console.log('❌ Something went wrong while pinning metadata to IPFS ❗');
          return {
            success: false,
            status: "❌ Something went wrong while pinning metadata to IPFS ❗",
          };
        } else {
          let tokenURI = pinataResponse.pinataUrl;
          console.log('📎 Metadata pinned at: ' + tokenURI);

          var price = '1.0';
          if (name.slice(0, -4).length === 3) {
            var price = '0.01';
          } else if (name.slice(0, -4).length === 4) {
            var price = '0.001';
          } else if (name.slice(0, -4).length >= 5) {
            var price = '0.0005';
          }

          window.contract = await new web3.eth.Contract(contractABI.abi, contractAddress);
          const transactionParameters = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            data: window.contract.methods
              .mintToken(messageHash, message, signature, tokenURI, name.slice(0, -4))
              .encodeABI(),
            value: web3.utils.toHex(web3.utils.toWei(price, "ether" )),
            chainID: '5',
            gas: '500000',
          };
          // console.log(transactionParameters);
          try {
            const txHash = await window.ethereum.request({
              method: "eth_sendTransaction",
              params: [transactionParameters],
            });
            // console.log(txHash);
            return {
              success: true,
              status: "🚀 Transaction sent! Check your wallet or OpenSea.",
            };
          } catch (error) {
            return {
              success: false,
              status: "❌ Something went wrong: " + error.message.toLowerCase(),
            };
          }
        }
      }
    } else {
      window.alert('❌ Something went wrong while uploading your tokenURI. Signature appears tampered! ❗');
      return {
        success: false,
        status: "❌ Something went wrong while uploading your tokenURI. Signature appears tampered! ❗",
      };
    }
  }
};
