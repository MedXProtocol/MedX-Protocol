/* global artifacts */

const Registry = artifacts.require('Registry.sol')
const Token = artifacts.require('MedXToken')
const Parameterizer = artifacts.require('Parameterizer.sol')
const DLL = artifacts.require('dll/DLL.sol')
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol')
const PLCRVoting = artifacts.require('PLCRVoting.sol')
const appendContract = require('truffle-deploy-registry').appendContract

const fs = require('fs');

module.exports = (deployer, network, accounts) => {
  deployer.link(DLL, Registry);
  deployer.link(AttributeStore, Registry);

  return deployer.then(async () => {
    const config = JSON.parse(fs.readFileSync('./conf/config.json'));
    let tokenAddress = config.token.address;

    if (config.token.deployToken) {
      tokenAddress = Token.address;
    }

    return deployer.deploy(
      Registry,
      tokenAddress,
      PLCRVoting.address,
      Parameterizer.address,
    ).then(() => {
      appendContract(deployer.network_id, Registry)
    })
  }).catch((err) => { throw err; });
};
