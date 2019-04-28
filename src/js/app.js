App = {
    /* Variables*/
    web3Provider: null,
    contracts: {},
    account: '0x0',
    currentDoctor: null,
    patientRecords: $("#patientRecords"),

provider1: {
        practiceName: "Dr Alice",
        practiceID: "314159",
        nonce:0,
        privateKey: ""
    },
    provider2: {
        practiceName: "Dr Bob",
        practiceID: "1235813",
        nonce:0,
        privateKey: ""
    },

    /* Functions to initialize the App
    do not need to be modified*/
    init: function() {
        console.log("calling initWeb3");
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            console.log(web3.version.api);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
            console.log(web3.version.api);
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

    initProviders: function() {
        App.provider1.privateKey=web3.sha3(App.provider1.name);
        App.provider2.privateKey=web3.sha3(App.provider1.name);
        App.currentDoctor = App.provider1;
    },

    render: function() {
        var medChainInstance;
        var loader = $("#loader");
        var content = $("#content");

        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });
        /** Modify after this only**/

        // Load contract data
        App.contracts.MedChain.deployed().then(function(instance) {
            medChainInstance = instance;
            App.initProviders();
            return medChainInstance.patientCount();
        }).then(function(patientCount) {
            //console.log(patientCount);
            //console.log(patientCount.c[0]);
            var patientSelect = $('#patientSelect');
            patientSelect.empty();

            for (var i = 0; i <= patientCount.c[0]; i++) {
                medChainInstance.patientAddresses(i).then(function(patientAdd) {
                    //console.log("Adding patient address: "+patientAdd);

                    medChainInstance.patients(patientAdd).then(function(patient){
                        //console.log(patient);
                        var name = patient[1];
                        //console.log("Adding patient name: "+ name);
                        var patientOption = "<option value='" + patientAdd + "' >" + name + "</ option>";
                        patientSelect.append(patientOption);
                    });
                });
            }
            loader.hide();
            content.show();
            App.patientRecords.hide();
            testDriver(medChainInstance);
        }).catch(function(error) {
            console.warn(error);
        });
    },

    loadGetRecords(){
        App.patientRecords.hide();
        $("#retrieveButton").show();
        $("#addButton").hide();
    },

    loadAddRecords(){
        App.patientRecords.hide();
        $("#retrieveButton").hide();
        $("#addButton").show();
    },

    /* Primary Application Behavior Functions*/
    // Need to implement
    getAuthorization: function(patientAddress,provider){
        return new Promise(function (resolve,reject) {
            App.contracts.MedChain.deployed().then(function(instance)
            {
               //console.log("Checking authorization");
                var stringToHash = provider.nonce + provider.privateKey;
                var hashedString = web3.sha3(stringToHash);
                console.log("Checking authorization with hash: " + hashedString);
                console.log("For patient: " + patientAddress);
                instance.checkAuth.call(patientAddress, hashedString).then(function(result) {
                    resolve(result);
                });//.then(function(result){
            });
        });
    },
    getRecordsHandler(){
        App.getRecords(App.currentDoctor);
    },
    newAuthHandler(){
        App.patientRecords.hide();
        App.createNewAuthorization(App.account,App.currentDoctor);
    },
    addRecordHandler(){
        App.patientRecords.hide();
        App.addRecord(App.currentDoctor);
    },
    getRecords: function(provider) {
        var patientRecords = $("#patientRecords");
        console.log("getRecords was called");
        var patientAddress = $('#patientSelect').val();
        App.contracts.MedChain.deployed().then(function(instance) {
            App.getAuthorization(patientAddress,provider).then(function(result){
                if(result){
                    console.log("Getting patient record file");
                    instance.getPatientRecordFile.call(patientAddress).then(function(result){
                        console.log("got here");
                        patientRecords.show();
                        console.log(result);
                        fetch(result)
                            .then(response => response.json())
                            .then(jsonResponse =>$("#patientRecords").html(JSON.stringify(jsonResponse,null,2)));
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                else{
                    window.alert("You are not authorized to view this patient's records!");
                }
            });
        }).catch(function(err) {
            console.error(err);
        });
    },
    addRecord: function(provider){
        var patientAddress = $('#patientSelect').val();
        App.contracts.MedChain.deployed().then(function(instance) {
            App.getAuthorization(patientAddress,provider).then(function(result){
                if(result){
                    instance.getPatientRecordFile.call(patientAddress).then(function(result){
                        console.log(result);
                        var fn = result;
                        fetch(fn)
                            .then(response => response.json())
                            .then(jsonResponse =>{
                                var jsonData = jsonResponse;
                                jsonData.push({
                                    "name": "Alice",
                                    "age": 25,
                                    "height": 65,
                                    "weight": 136,
                                    "bloodPressure":{
                                        "sys": 125,
                                        "dia": 95
                                    },
                                    "scripts": ["EpiPen","Allergy Shots"],
                                    "allergies": [
                                        "tree pollen",
                                        "Oak",
                                        "bees"],
                                    "conditions":[
                                    ],
                                    "doctorOfRecord": "Dr Bob",
                                    "dateOfRecord":"12/13/2015"
                                });
                                console.log(JSON.stringify(jsonData,null,2));
                                App.download(JSON.stringify(jsonData,null,2),fn,'text/plain');
                            });
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                else{
                    window.alert("You are not authorized to view this patient's records!");
                }
            });
        }).catch(function(err) {
            console.error(err);
        });
    },

    download: function(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    },

    createNewAuthorization(patientAdd,provider){

        App.contracts.MedChain.deployed().then(function(instance) {
            var stringToHash = provider.nonce + provider.privateKey;
            var hashedString = web3.sha3(stringToHash);
            console.log("Creating new authorization with hash" + hashedString);
            console.log("For patient: " + patientAdd);
            instance.addAuthorization(patientAdd, hashedString).then(function(){
                location.reload(true);
            });
        });
    },

    removeAuthorization(patientAdd,provider){
        App.contracts.MedChain.deployed().then(function(instance) {
            var stringToHash = provider.nonce + provider.privateKey;
            var hashedString = web3.sha3(stringToHash);
            console.log("Removing authorization with hash" + hashedString);
            console.log("For patient: " + patientAdd);
            instance.removeAuthorization(patientAdd, hashedString);
        });

    }

};

async function testDriver(){
    //App.removeAuthorization("0xdca5f28457838416a67fe0f0fabb7c1ef981926c",(App.currentDoctor));
    //App.createNewAuthorization(App.account,App.currentDoctor);
    console.log(await App.getAuthorization(App.account, App.currentDoctor));
    //App.removeAuthorization(App.account,App.currentDoctor);
    //console.log("Current address:" + App.account);
    console.log(await App.getAuthorization("0xF00f3032d37b68857250Ad8faaF06bcD115e23a5", App.currentDoctor));
}

/* Utility Functions*/

// No need to modify
$(function() {
    $(window).load(function() {
        App.init();
    });
});


