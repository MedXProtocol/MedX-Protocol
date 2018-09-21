var Migrations = artifacts.require("./Migrations.sol");
var appendContract = require('truffle-deploy-registry').appendContract

module.exports = function(deployer) {
  deployer.deploy(Migrations).then(() => {
    return appendContract(deployer.network_id, Migrations)
  })
};
