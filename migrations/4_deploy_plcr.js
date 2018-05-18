/* global artifacts */

const Token = artifacts.require('MedXToken.sol');
const DLL = artifacts.require('dll/DLL.sol');
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const fs = require('fs');

module.exports = (deployer, network, accounts) => {
  deployer.link(DLL, PLCRVoting);
  deployer.link(AttributeStore, PLCRVoting);

  return deployer.then(async () => {
    const config = JSON.parse(fs.readFileSync('./conf/config.json'));
    let tokenAddress = config.token.address;

    if (config.token.deployToken) {
      tokenAddress = Token.address;
    }

    return deployer.deploy(
      PLCRVoting,
      tokenAddress,
    );
  }).catch((err) => { throw err; });
};
