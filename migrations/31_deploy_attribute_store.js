/* global artifacts */

const DLL = artifacts.require('dll/DLL.sol')
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol')
const appendContract = require('truffle-deploy-registry').appendContract

module.exports = (deployer) => {
  deployer.deploy(AttributeStore).then(() => {
    return appendContract(deployer.network_id, AttributeStore)
  })
};
