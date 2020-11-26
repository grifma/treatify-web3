pragma solidity ^0.5.16;

import "./Treaty.sol";
import "./DistributeEmbedded.sol";

contract DistributingTreaty is Treaty, DistributeEmbedded {
    
  /// Split agreements ///
  uint[] public proposedSplit;


  /// Events ///
  event SignHash(address indexed _signer, bytes32 indexed _hash);

//   constructor(
//     uint256 _id,
//     string memory _name,
//     string memory _initialText
//   ) 
//     public
//     Treaty(_id, _name, _initialText)
//     DistributeEmbedded() {
//     id = _id;
//     name = _name;
//     unsignedTreatyText.push(_initialText);
//     lawyerAddress = msg.sender;
//   }

  constructor(
    
  ) 
    public
    Treaty(1, 'Name', 'Initial text')
    DistributeEmbedded() {
    id = 1;
    name = 'Name';
    unsignedTreatyText.push("_initialText");
    lawyerAddress = msg.sender;
  }


  function registerAsSigner() public inState(States.Draft) stateChange() {
    super.registerAsSigner();
    addAccount(msg.sender);
  }

  function signTreaty() public inState(States.Active) stateChange() returns (bool) {
    super.signTreaty();
    delete proposedSplit;
  }

  function signHash(bytes32 _hash) public inState(States.Active) stateChange() returns (bool) {
    super.signHash(_hash);
    delete proposedSplit;
  }  
  
  function isProposedSplit(uint256[] memory _split) internal view returns (bool) {
    if(proposedSplit.length == 0) {
        return false;
    }
    bool result = true;
    for(uint i=0; i<_split.length; i++) {
        if(_split[i] != proposedSplit[i]){
            result = false;
        }
    }
    return result;
  }
  
  function signHashWithSplit(bytes32 _hash, uint256[] memory _split) public inState(States.Active) stateChange() returns (bool) {
    //require(_split.length == signatureList.length, "One split value required per signer");
    validSplit(_split);
    
    if(!isProposedSplit(_split)) {
      resetSignatures();
      proposedSplit = _split;
    }
    
    bool allSignersApproved = super.signHash(_hash);
    if(allSignersApproved) {
        setSplit(proposedSplit);
    }
    return allSignersApproved;
  }

}
