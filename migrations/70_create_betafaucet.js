const BetaFaucet = artifacts.require('BetaFaucet.sol')
const MedXToken = artifacts.require('MedXToken.sol')
const appendContract = require('truffle-deploy-registry').appendContract

module.exports = async (deployer) => {
  deployer.then(async () => {
    const medXTokenInstance = await MedXToken.deployed()

    await deployer.deploy(BetaFaucet).then(async (betaFaucetInstance) => {
      await medXTokenInstance.mint(betaFaucetInstance.address, 100000000000000000000000000)
      await betaFaucetInstance.init(medXTokenInstance.address)
      await appendContract(deployer.network_id, BetaFaucet)
    })
  })
};
