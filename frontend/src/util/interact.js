import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyURL = process.env.REACT_APP_ALCHEMY_URL_MAINNET;
const contractABI = require("../contract-abi.json");
const contractAddress = '0x14ab45f6edc154e338e27f8d1d2a7cad4ed62ec2';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyURL);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Enter ENS & click 'NEXT'",
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
          status: "👆🏽 Enter ENS & click 'NEXT'",
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
    console.log('⌛ Minting...');
    const jsonData = await getJSON(url);
    // console.log(jsonData);

    if (jsonData.signature === signature) {
      if (!url) {
        window.alert('❌ Metadata URI missing ❗');
        return {
          success: false,
          status: "❌ Metadata URI missing ❗",
        };
      } else {
        const pinataResponseMetadata = await pinJSONToIPFS(jsonData);
        if (!pinataResponseMetadata.success) {
          console.log('❌ Something went wrong while pinning metadat/image to IPFS ❗');
          return {
            success: false,
            status: "❌ Something went wrong while pinning metadata/image to IPFS ❗",
          };
        } else {
          let tokenIPFS = pinataResponseMetadata.pinataUrl;
          let tokenURI = url
          console.log('📎 metadata pinned at: ' + tokenIPFS);
          console.log('📎 tokenURI is set at: ' + tokenURI);

          var price = '1.0';
          if (name.slice(0, -4).length === 3) {
            price = '0.05';
          } else if (name.slice(0, -4).length === 4) {
            price = '0.01';
          } else if (name.slice(0, -4).length >= 5) {
            price = '0.005';
          }

          window.contract = await new web3.eth.Contract(contractABI.abi, contractAddress);
          const transactionParameters = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            data: window.contract.methods
              .mintToken(messageHash, message, signature, tokenURI, name.slice(0, -4))
              .encodeABI(),
            value: web3.utils.toHex(web3.utils.toWei(price, "ether" )),
            chainID: '1',
            gas: web3.utils.toHex('175000'),
          };

          try {
            const txHash = await window.ethereum.request({
              method: "eth_sendTransaction",
              params: [transactionParameters],
            });
            console.log(txHash);

            return {
              success: true,
              status: "🚀 Transaction sent! Check your wallet or LooksRare/Rarible/OpenSea.",
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
