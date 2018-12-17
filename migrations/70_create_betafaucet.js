const BetaFaucet = artifacts.require('BetaFaucet.sol')
const appendContract = require('truffle-deploy-registry').appendContract

module.exports = (deployer) => {
  deployer.deploy(BetaFaucet).then(() => {
    return appendContract(deployer.network_id, BetaFaucet)
  })
};
