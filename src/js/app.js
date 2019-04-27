App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    /** Does not need to be modified*/
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
        $.getJSON("MedChain.json", function(meds) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.MedChain = TruffleContract(meds);
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
                //$("#accountAddress").html("Your Account: " + account);
            }
        });
        /** Modify after this only**/

        // Load contract data
        App.contracts.MedChain.deployed().then(function(instance) {
            medChainInstance = instance;
            return medChainInstance.candidatesCount();
        }).then(function(c) {

            var patientSelect = $('#patientSelect');
            patientSelect.empty();

            for (var i = 1; i <= candidatesCount; i++) {
                medChainInstance.patientAddresses(i).then(function(patientAdd) {
                    medChainInstance.patients[patientAdd].then(function(patient){
                    var name = patient.name;

                    // Render candidate ballot option
                    var patientOption = "<option value='" + patientAdd + "' >" + name + "</ option>";
                    patientSelect.append(patientOption);
                    });
                });
            }
            return medChainInstance.patients(App.account);
        }).catch(function(error) {
            console.warn(error);
        });
    },

    castVote: function() {
        var candidateId = $('#candidatesSelect').val();
        App.contracts.Election.deployed().then(function(instance) {
            return instance.vote(candidateId, { from: App.account });
        }).then(function(result) {
            // Wait for votes to update
            $("#content").hide();
            $("#loader").show();
        }).catch(function(err) {
            console.error(err);
        });
    },

   /* listenForEvents: function() {
        App.contracts.Election.deployed().then(function(instance) {
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log("event triggered", event)
                // Reload when a new vote is recorded
                App.render();
            });
        });
    }*/
};


//No need to modify
$(function() {
    $(window).load(function() {
        App.init();
    });
});