pragma solidity >=0.4.24 < 0.6.0;

contract MedChain {

    //Addresses for sample patients
    //need to create accounts on MetaMask for these
    address public address1=0xdCA5F28457838416A67FE0f0fabb7c1eF981926c ;
    address public address2=0xF00f3032d37b68857250Ad8faaF06bcD115e23a5;

    struct Patient {
        address patientAddress;
        string name;
        string records;
        mapping(string => bool) authList;
    }

    //Patient list
    mapping(address => Patient) public patients;
    uint public patientCount=0;

    constructor () public {
        addPatient(address1,"Alice Adams","file1.json");
        addPatient(address2,"Bob Barkins","file2.json");
    }

    function addPatient (address _address,string memory name,string memory recs) private {
        patients[_address] = Patient(_address,name,recs);
        patientCount++;
    }

    function addAuthorization (address patientAddress, string memory providerHash,uint providerID) public {
        patients[patientAddress].authList[providerHash] = true;
    }

    function checkAuth(address patientAddress, string memory providerHash) public returns(bool) {
        return patients[patientAddress].authList[providerHash];
    }
}