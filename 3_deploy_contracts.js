var MedChain = artifacts.require("./MedChain.sol");

module.exports = function(deployer) {
    deployer.deploy(MedChain);
};