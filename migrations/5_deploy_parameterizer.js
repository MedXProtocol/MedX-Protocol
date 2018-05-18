/* global artifacts */

const Token = artifacts.require('MedXToken.sol');
const Parameterizer = artifacts.require('Parameterizer.sol');
const DLL = artifacts.require('dll/DLL.sol');
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const fs = require('fs');

module.exports = (deployer, network, accounts) => {
  deployer.link(DLL, Parameterizer);
  deployer.link(AttributeStore, Parameterizer);

  return deployer.then(async () => {
    const config = JSON.parse(fs.readFileSync('./conf/config.json'));
    const parameterizerConfig = config.paramDefaults;
    let tokenAddress = config.token.address;

    if (config.token.deployToken) {
      tokenAddress = Token.address;
    }

    return deployer.deploy(
      Parameterizer,
      tokenAddress,
      PLCRVoting.address,
      parameterizerConfig.minDeposit,
      parameterizerConfig.pMinDeposit,
      parameterizerConfig.applyStageLength,
      parameterizerConfig.pApplyStageLength,
      parameterizerConfig.commitStageLength,
      parameterizerConfig.pCommitStageLength,
      parameterizerConfig.revealStageLength,
      parameterizerConfig.pRevealStageLength,
      parameterizerConfig.dispensationPct,
      parameterizerConfig.pDispensationPct,
      parameterizerConfig.voteQuorum,
      parameterizerConfig.pVoteQuorum,
    );
  }).catch((err) => { throw err; });
};
