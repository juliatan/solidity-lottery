## About

- This is a test project that I've written to learn Solidity.
- It's a smart contract that allows players to enter a lottery that picks a random winner.

### Packages

- Web3 (JavaScript interface to Ethereum blockchain)
- Ganache (testing)
- Mocha (testing)
- Infura (deploying to test network node)
- Truffle (wallet + deployment provider)
- dotenv (storing environment variables)

### To run

- `npm run test` - run test suite
- `node deploy.js` - deploy contract to test network
  - You'll need to create a `.env` file with your `INFURA_API` and Metamask wallet `MNEMONIC`. This is parsed in `compile.js`, so that the variables are available when running `node deploy.js`.
  - If you get an error to do with `ERR_OSSL_EVP_UNSUPPORTED`, it'll be due to an issue with the node version you're using. I use `nvm` to switch to version 15.8.0, which does the trick.

## Resources

- https://infura.io/ - Free API to connect to an Ethereum test network node
- https://rinkeby.etherscan.io/ - Etherscan Rinkeby test network
- https://faucets.chain.link/rinkeby - request test ether
- https://eth-converter.com/extended-converter.html - Eth converter
