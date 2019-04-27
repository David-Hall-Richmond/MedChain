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
            return medChainInstance.patientCount();
        }).then(function(patientCount) {
            var patientSelect = $('#patientSelect');
            patientSelect.empty();

            //this needs to be fixed, below is a dummy function just to get things working
            /*for (var i = 1; i <= patientCount; i++) {
                medChainInstance.patientAddresses(i).then(function(patientAdd) {
                    medChainInstance.patients[patientAdd].then(function(patient){
                        var name = patient.name;

                        var patientOption = "<option value='" + patientAdd + "' >" + name + "</ option>";
                        patientSelect.append(patientOption);
                    });
                });
            }*/
            for (var i = 1; i <= patientCount; i++) {
                        var name = "Bob Jones";
                        var patientAdd = "Dummy Address";

                        var patientOption = "<option value='" + patientAdd + "' >" + name + "</ option>";
                        patientSelect.append(patientOption);


            }

            loader.hide();
            content.show();
        }).catch(function(error) {
            console.warn(error);
        });
    },

    getRecords: function() {
        var patientAddress = $('#patientSelect').val();
        App.contracts.medChain.deployed().then(function(instance) {
            console.log("Getting Authorization: ");
            console.log(instance.checkAuth(patientAddress, "123456"));
            return instance.auth(patientAddress, { from: App.account });
        }).then(function(result) {
            console.log(result);
        }).catch(function(err) {
            console.error(err);
        });
    },
    /* to be implemented
    getAuthorization: function(){
        create hash of private key and nonce
        get patient address
        call checkAuth() contract function and return
    },
    addRecord: function(){
        call getAuthorization()
        open connection to file
        append new record to file
        close file
    },
    createNewAuthorization(){
        get patient information from MetaMask
        create hash
        send info into addAuthorization() in Contract
    },
    */

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