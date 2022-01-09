if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const fs = require('fs')
const solc = require('solc')

// use path to ensure it works across windows, unix etc
// __dirname is the pwd provided by node
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol')
const source = fs.readFileSync(lotteryPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery
