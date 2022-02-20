/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 require("@nomiclabs/hardhat-ethers");
 require("@nomiclabs/hardhat-waffle");
 require("@nomiclabs/hardhat-etherscan");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "L7HNiKzgBSdhONZZB3HoBCteXJeqB18L2";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const RINKEBY_PRIVATE_KEY = "fb81b1c723d4c44fc31abb1fecc6fe19f4ad48a2a911216102393e5b1a765eb12";


 module.exports = {   solidity: {
  compilers: [
    {
      version: "0.8.0",
    },
    {
      version: "0.8.1",
      settings: {},
    },
  ],   
}, 
networks: {
  rinkeby: {
    url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    accounts: [`${RINKEBY_PRIVATE_KEY}`]
  }
}
};