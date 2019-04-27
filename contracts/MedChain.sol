pragma solidity 0.5.0;

contract MedChain {

    struct Provider {
        uint id;
        string name;
        uint authenticateCount;
    }

    //provider list
    mapping(uint => Provider) public providers;

    //authenticator list
    mapping(address => bool) public authenticators;
    uint public providersCount;

    constructor () public {
        addProvider("Provider 1");
        addProvider("Provider 2");
    }

    function addProvider (string memory _name) private {
        providersCount++;
        providers[providersCount] = Provider(providersCount, _name,0);
    }

    function authenticate (uint _providerID) public {
        require(!authenticators[msg.sender]);
        require(_providerID > 0 && _providerID <= providersCount);

        authenticators[msg.sender] = true;
        providers[_providerID].authenticateCount++;

        emit authenticatedEvent(_providerID);
    }

    event authenticatedEvent (
         uint indexed _providerID
    );
}