/* global artifacts */

const Token = artifacts.require('MedXToken.sol')
const DLL = artifacts.require('dll/DLL.sol')
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol')
const PLCRVoting = artifacts.require('PLCRVoting.sol')
const appendContract = require('truffle-deploy-registry').appendContract

const fs = require('fs');

module.exports = (deployer, network, accounts) => {
  deployer.link(DLL, PLCRVoting);
  deployer.link(AttributeStore, PLCRVoting);

  return deployer.then(async () => {
    await Token.deployed()
    const tokenAddress = Token.address
    return deployer.deploy(
      PLCRVoting,
      tokenAddress,
    ).then(() => {
      return appendContract(deployer.network_id, PLCRVoting)
    })
  }).catch((err) => { throw err; });
};
