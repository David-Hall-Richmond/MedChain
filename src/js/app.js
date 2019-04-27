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

            // This needs to be fixed, below is a dummy function just to get things working
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

    // Need to implement
    getAuthorization: function(){
        // Create hash of private key and nonce

        // Get patient address
            // Call checkAuth() contract function
            console.log(instance.checkAuth(patientHash, "1234567"));
            // Call checkAuth() contract function
            console.log(instance.checkAuth(patientAddress, "123456"));
            // Return
            return instance.auth(patientAddress, { from: App.account });
        }).then(function(result) {
            console.log(result);
        }).catch(function(err) {
            console.error(err);
        });
    },

    addRecord: function(){
        // Call getAuthorization()
        // Open connection to file
        // Append new record to file
        // Close file

    },

    createNewAuthorization(){
        // Get patient information from MetaMask
        // Create hash
        // Send info into addAuthorization() in Contract
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

// No need to modify
$(function() {
    $(window).load(function() {
        App.init();
    });
});


////////////////////////////////////////////////////////////////

// Section for nonceHash is probaly ok, 
// everything else may help some though its no good
// best to get rid of rest from here down.

/* Section for nonceHash in js

        var Web3 = require("web3")
        String message = "Private Key"
        web3.eth.accounts.hashMessage(message)

        String nonceKey = "12345";
        // E.g. "00000" :
        String zeroGoal = new String(new char[nonceKey.length()]).replace("\0", "0");

        long nonce = 0;
        boolean isNonceFound = false;
        String nonceHash = "";

        long start = Date.now();

        while (!isNonceFound) {

            nonceHash = web3.eth.accounts.hashMessage(message + nonce);
            isNonceFound = nonceHash.substring(0, nonceKey.length()).equals(zeroGoal);
            if (!isNonceFound) {
                nonce++;
            }
        }

        long ms = Date.now() - start;

        console.log(String.format("Nonce: %d", nonce));
        console.log(String.format("Nonce Hash: %s", nonceHash));
        console.log(String.format("Nonce Search Time: %s ms", ms));
*/

/*
        GitHost.prototype.hash = function () {
  return this.committish ? '#' + this.committish : ''
}
        var patientHash = $('#patientSelect').val();

        // Get patient address
            // Call checkAuth() contract function
            console.log(instance.checkAuth(patientHash, "1234567"));
            // Call checkAuth() contract function
            console.log(instance.checkAuth(patientAddress, "123456"));
            // Return
            return instance.auth(patientAddress, { from: App.account });
        }).then(function(result) {
            console.log(result);
        }).catch(function(err) {
            console.error(err);
        });
    },

    addRecord: function(){
        // Call getAuthorization()
        getAuthorization()

        // Open connection to file

    var currentFilePath = opts.currentFilePath;

    opts.logger.debug("Reading the file: %s", currentFilePath);

    var read;

    try {
        read = fs.readFileSync(currentFilePath, "utf8");
    } catch (e) {
        opts.errored = true;
        return opts.logger.info(messages.fileNotFound(path.basename(currentFilePath)));
    }

    var found = false;

 var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

        // Server Example
        ```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
```
// Express js example
```js
const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});
```
        // Append new record to file

        errorEx.append = function (str, def) {
    return {
        message: function (v, message) {
            v = v || def;

            if (v) {
                message[0] += ' ' + str.replace('%s', v.toString());
            }

            return message;
        }
    };
};
utils.append = function(val) {
  return function(node) {
    append(this, val, node);
  };
};
function append(compiler, val, node) {
  if (typeof compiler.append !== 'function') {
    return compiler.emit(val, node);
  }
  return compiler.append(val, node);
}

        // Close file

        // Returns instance of FSWatcher for chaining.
FSWatcher.prototype.close = function() {
  if (this.closed) return this;

  this.closed = true;
  Object.keys(this._closers).forEach(function(watchPath) {
    this._closers[watchPath]();
    delete this._closers[watchPath];
  }, this);
  this._watched = Object.create(null);

  this.removeAllListeners();
  return this;
};
    },

    createNewAuthorization(){
        get patient information from MetaMask
        // Create hash
GitHost.prototype.hash = function () {
  return this.committish ? '#' + this.committish : ''
}
        // Send info into addAuthorization() in Contract
function send (req, path, options) {
  return new SendStream(req, path, options)
}

  function Contract(contract) {
    var self = this;
    var constructor = this.constructor;
    this.abi = constructor.abi;

    if (typeof contract == "string") {
      var address = contract;
      var contract_class = constructor.web3.eth.contract(this.abi);
      contract = contract_class.at(address);
    }

    },
*/