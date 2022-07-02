/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL_MAINNET, API_URL_GOERLI, PRIVATE_KEY_MAINNET, PRIVATE_KEY_GOERLI} = process.env;
module.exports = {
   solidity: "0.8.4",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      mainnet: {
         url: API_URL_MAINNET,
         accounts: [`0x${PRIVATE_KEY_MAINNET}`],
         gas: 350000,
         gasPrice: 30000000000
      },
      goerli: {
         url: API_URL_GOERLI,
         accounts: [`0x${PRIVATE_KEY_GOERLI}`],
         gas: 350000,
         gasPrice: 2000000000
      }
   }
}
