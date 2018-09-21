/* global artifacts */

const Token = artifacts.require('MedXToken');
const appendContract = require('truffle-deploy-registry').appendContract

const fs = require('fs');

module.exports = (deployer, network, accounts) => {
  const config = JSON.parse(fs.readFileSync('./conf/config.json'));

  async function giveTokensTo(tokenHolders) {
    if (tokenHolders.length === 0) { return; }
    const token = await Token.deployed();
    const tokenHolder = tokenHolders[0];

    const displayAmt = tokenHolder.amount.slice(
      0,
      tokenHolder.amount.length - parseInt(config.token.decimals, 10),
    );
    // eslint-disable-next-line no-console
    console.log(`Allocating ${displayAmt} ${config.token.symbol} tokens to ` +
    `${tokenHolder.address}.`);

    await token.transfer(tokenHolder.address, tokenHolder.amount);

    giveTokensTo(tokenHolders.slice(1));
  }

  if (config.token.deployToken) {
    deployer.deploy(Token)
        .then(async () => {
            const _token = await Token.deployed();
            await appendContract(deployer.network_id, Token)
            return _token.mint(accounts[0], config.token.supply, {from: accounts[0]});
        })
        .then(async () => giveTokensTo(config.token.tokenHolders));
  } else {
    // eslint-disable-next-line no-console
    console.log('skipping optional token deploy and using the token at address ' +
      `${config.token.address} on network ${network}.`);
  }
};
