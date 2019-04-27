var MedChain = artifacts.require("./MedChain.sol");

contract("MedChain", function(accounts) {
    var MedChainInstance;

    it("initializes with two providers", function() {
        return MedChain.deployed().then(function(instance) {
            return instance.providersCount();
        }).then(function(count) {
            assert.equal(count, 2);
        });
    });

    it("it initializes the providers with the correct values", function() {
        return MedChain.deployed().then(function(instance) {
            MedChainInstance = instance;
            return MedChainInstance.providers(1);
        }).then(function(provider) {
            assert.equal(provider[0], 1, "contains the correct id");
            assert.equal(provider[1], "Provider 1", "contains the correct name");
            assert.equal(provider[2], 0, "contains the correct authenticates count");
            return MedChainInstance.providers(2);
        }).then(function(provider) {
            assert.equal(provider[0], 2, "contains the correct id");
            assert.equal(provider[1], "Provider 2", "contains the correct name");
            assert.equal(provider[2], 0, "contains the correct authenticates count");
        });
    });

    it("allows a authenticator to cast a authenticate", function() {
        return MedChain.deployed().then(function(instance) {
            MedChainInstance = instance;
            providerId = 1;
            return MedChainInstance.authenticate(providerId, { from: accounts[0] });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "authenticatedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._providerId.toNumber(), providerId, "the provider id is correct");
            return MedChainInstance.authenticators(accounts[0]);
        }).then(function(authenticated) {
            assert(authenticated, "the authenticator was marked as authenticated");
            return MedChainInstance.providers(providerId);
        }).then(function(provider) {
            var authenticateCount = provider[2];
            assert.equal(authenticateCount, 1, "increments the provider's authenticate count");
        })
    });

    it("throws an exception for invalid providers", function() {
        return MedChain.deployed().then(function(instance) {
            MedChainInstance = instance;
            return MedChainInstance.authenticate(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return MedChainInstance.providers(1);
        }).then(function(provider1) {
            var authenticateCount = provider1[2];
            assert.equal(authenticateCount, 1, "provider 1 did not receive any authenticates");
            return MedChainInstance.providers(2);
        }).then(function(provider2) {
            var authenticateCount = provider2[2];
            assert.equal(authenticateCount, 0, "provider 2 did not receive any authenticates");
        });
    });
});