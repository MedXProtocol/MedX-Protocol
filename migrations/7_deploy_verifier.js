var ListingVerifier = artifacts.require("./ListingVerifier.sol");

module.exports = function(deployer) {
    deployer.deploy(ListingVerifier);
};