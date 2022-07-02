import Moralis from 'moralis/node.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const alchemyKey = process.env.ALCHEMY_KEY_MAINNET;
const moralisUrl = process.env.MORALIS_URL_MAINNET;
const moralisApp = process.env.MORALIS_APP_MAINNET;
const moralisKey = process.env.MORALIS_KEY_MAINNET;

// contract
const contractAddr = "0x14ab45f6edc154e338e27f8d1d2a7cad4ed62ec2";
const tokenId = "12";
const tokenType = "erc721";
const chain = 'mainnet';

/*
// moralis
await Moralis.start({
            serverUrl: moralisUrl,
            appId: moralisApp,
            masterKey: moralisKey,
        });

const options = {
  address: contractAddr,
  token_id: tokenId,
  chain: chain,
};

const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
console.log(tokenIdMetadata);
*/

// alchemy
const apiKey = alchemyKey;
const baseURL = `https://eth-${chain}.alchemyapi.io/nft/v2/${apiKey}/getNFTMetadata`;

var config = {
  method: 'get',
  url: `${baseURL}?contractAddress=${contractAddr}&tokenId=${tokenId}&tokenType=${tokenType}`,
  headers: { }
};

axios(config)
.then(response => console.log(JSON.stringify(response.data, null, 2)))
.catch(error => console.log(error));
