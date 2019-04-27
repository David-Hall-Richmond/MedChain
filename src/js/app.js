App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function() {
        $.getJSON("MedChain.json", function(medChain) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.MedChain = TruffleContract(medChain);
            // Connect provider to interact with contract
            App.contracts.MedChain.setProvider(App.web3Provider);

            return App.render();
        });
    },

    render: function() {
        var medChainInstance;
        var loader = $("#loader");
        var content = $("#content");

        loader.show();
        content.hide();

        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });

        // Load contract data
        App.contracts.MedChain.deployed().then(function(instance) {
            medChainInstance = instance;
            return medChainInstance.providersCount();
        }).then(function(providersCount) {
            var providersResults = $("#providersResults");
            providersResults.empty();

            var providersSelect = $('#providersSelect');
            providersSelect.empty();

            for (var i = 1; i <= providersCount; i++) {
                medChainInstance.providers(i).then(function(provider) {
                    var id = provider[0];
                    var name = provider[1];
                    var voteCount = provider[2];

                    // Render provider Result
                    var providerTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                    providersResults.append(providerTemplate);

                    // Render provider ballot option
                    var providerOption = "<option value='" + id + "' >" + name + "</ option>"
                    providersSelect.append(providerOption);
                });
            }
            return medChainInstance.voters(App.account);
        }).then(function(hasVoted) {
            // Do not allow a user to vote
            if(hasVoted) {
                $('form').hide();
            }
            loader.hide();
            content.show();
        }).catch(function(error) {
            console.warn(error);
        });
    },

    castVote: function() {
        var providerId = $('#providersSelect').val();
        App.contracts.medChain.deployed().then(function(instance) {
            return instance.vote(providerId, { from: App.account });
        }).then(function(result) {
            // Wait for votes to update
            $("#content").hide();
            $("#loader").show();
        }).catch(function(err) {
            console.error(err);
        });
    },

    listenForEvents: function() {
        App.contracts.MedChain.deployed().then(function(instance) {
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log("event triggered", event)
                // Reload when a new vote is recorded
                App.render();
            });
        });
    },

    initContract: function() {
        $.getJSON("MedChain.json", function(medChain) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.MedChain = TruffleContract(medChain);
            // Connect provider to interact with contract
            App.contracts.MedChain.setProvider(App.web3Provider);

            App.listenForEvents();

            return App.render();
        });
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});