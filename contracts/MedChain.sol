pragma solidity 0.5.0;

contract MedChain {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    //candidate list
    mapping(uint => Candidate) public candidates;

    //voter list
    mapping(address => bool) public voters;
    uint public candidatesCount;

    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name,0);
    }

    function vote (uint _candidateID) public {
        require(!voters[msg.sender]);
        require(_candidateID > 0 && _candidateID <= candidatesCount);

        voters[msg.sender] = true;
        candidates[_candidateID].voteCount++;

        emit votedEvent(_candidateID);
    }

    event votedEvent (
         uint indexed _candidateID
    );
}