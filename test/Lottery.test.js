const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const { interface, bytecode } = require('../compile')

let lottery
let accounts

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  // deploy an instance of the contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address) // assert.ok checks for existence
  })

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    assert.equal(accounts[0], players[0])
    assert.equal(1, players.length)
  })

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])
    assert.equal(3, players.length)
  })

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0,
      })
      assert(false) // if this line is reached, the test fails because it meant the await function succeeded
    } catch (err) {
      assert(err) // checks for truthiness
    }
  })

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    })

    const initialBalance = await web3.eth.getBalance(accounts[0])

    // Note, pick winner is random but we only entered 1 player
    await lottery.methods.pickWinner().send({ from: accounts[0] })

    const finalBalance = await web3.eth.getBalance(accounts[0])

    const difference = finalBalance - initialBalance
    // need to account for the gas cost which we don't know the exact amount of (you could do a console log to find out)
    assert(difference > web3.utils.toWei('1.8', 'ether'))

    const players = await lottery.methods.getPlayers().call()
    assert.equal(0, players.length)

    const balance = await web3.eth.getBalance(lottery.options.address)
    assert.equal(0, balance)
  })
})
