/* global artifacts */

const Token = artifacts.require('MedXToken');
const appendContract = require('truffle-deploy-registry').appendContract

const fs = require('fs');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Token)
    .then(async () => {
      const _token = await Token.deployed();
      await appendContract(deployer.network_id, Token)
    })
};
