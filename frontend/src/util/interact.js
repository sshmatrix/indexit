//import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractAddress = '0x709B40d05e32F3900eba40577732Df96F3Fc082f';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Click 'NEXT →' to initialise",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      console.log("❌ Failed to initialise: " + err.message);
      return {
        address: "",
        status: "❌ Failed to initialise: " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" You must install  "}
            <a target="_blank" href={`https://metamask.io/download.html`} rel="noreferrer">
              MetaMask browser extension
            </a>
            {"  & connect using 'Connect Wallet' button!"}
          </p>
        </span>
      ),
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
          status: "👆🏽 Click 'NEXT →' to initialise",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to MetaMask using 'Connect Wallet' button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "❌ " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install MetaMask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
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
    await fetch(`https://indexit.club/public/${url}/${url}.json`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.signature === signature) {
          console.log('📎 Metadata pinned! ⌛ Minting Card... Please wait!');
        } else {
          window.alert('❌ Something went wrong while uploading your tokenURI. Signature appears tampered! ⚠️');
          return {
            success: false,
            status: "❌ Something went wrong while uploading your tokenURI. Signature appears tampered! ⚠️",
          };
        }
      });

      //const tokenURI = pinataResponse.pinataUrl;
      const tokenURI = url;
      window.contract = await new web3.eth.Contract(contractABI.abi, contractAddress);

      const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        data: window.contract.methods
          .mintToken(messageHash, message, signature, tokenURI, name)
          .encodeABI(),
        maxPriorityFeePerGas: '100000000',
        maxFeePerGas: '200000000',
        gas: '400000',
        value: '1',
      };

      try {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
        return {
          success: true,
          status: (
            <span>
              <p>
                {" "}
                🦊{"🥳🥳🥳 Card Minted! ✅ Transaction Hash: "}
                <a target="_blank" rel="noreferrer" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
                  {txHash}
                </a>
              </p>
            </span>
          ),
        };
      } catch (error) {
        window.alert("❌ Something went wrong: " + error.message);
        return {
          success: false,
          status: "❌ Something went wrong: " + error.message,
        };
      }
    }
};
