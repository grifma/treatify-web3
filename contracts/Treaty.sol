pragma solidity ^0.5.16;

import "./TreatyStateMachine.sol";
import "./StringUtils.sol";
import "./Lockable.sol";

contract Treaty is TreatyStateMachine, Lockable {
    
  /// Treaty info ///
  uint256 public id;
  string public name;

  /// Signature state ///
  mapping(address => SignatureState) public signatureState;

  /// Agreement text (plain text) ///
  string[] public unsignedTreatyText;
  string[] public signedTreatyText;
  
  /// Agreement text (bytes32 hash) ///
  bytes32[] public unsignedHash;
  bytes32[] public signedHash;

  /// Addresses ///
  address[] public signatureList;
  address public lawyerAddress;

  /// Enums ///
  enum SignatureState { NotRegistered, Unsigned, Signed, Withdrawn, Broken }

  /// Events ///

  event SignedBy(address indexed _signer);
  event SignHash(address indexed _signer, bytes32 indexed _hash);
  event SignedByAll(address indexed _treatyAddress);
  event WithdrawnFromTreaty(address indexed _signer);
  event MutuallyWithdrawn();
  event StateChange(States _newState);
  event UnsignedTreatyTextDeleted();
  event ChangeLawyer(address indexed _lawyerAddress);
  event WriteToTreaty(string indexed _text);
  event MakeActive(address indexed _treatyAddress);
  event RegisterAsSigner(address _signer);

  constructor(
    uint256 _id,
    string memory _name,
    string memory _initialText
  ) 
    public {
    id = _id;
    name = _name;
    unsignedTreatyText.push(_initialText);
    lawyerAddress = msg.sender;
  }

  //////////////
  //Functions used by parties:
  //////////////

  function registerAsSigner() public inState(States.Draft) stateChange() {
    signatureState[msg.sender] = SignatureState.Unsigned;
    signatureList.push(msg.sender);
    emit RegisterAsSigner(msg.sender);
  }

  function makeActive() public inState(States.Draft) stateChange() {
    treatyState = States.Active;
    emit MakeActive(address(this));
  }

  function writeToTreaty(string memory _text) public inState(States.Active) {
    unsignedTreatyText.push(_text);
    resetSignatures();
    emit WriteToTreaty(_text);
  }

  function signTreaty() public inState(States.Active) stateChange() returns (bool) {
    require(
      signatureState[msg.sender] == SignatureState.Unsigned,
      "Unexpected signature"
    );
    signatureState[msg.sender] = SignatureState.Signed;
    emit SignedBy(msg.sender);

    if (allSignaturesInState(SignatureState.Signed)) {
      confirmTreatyText();
      return true;
    }
    return false;
  }

  function signHash(bytes32 _hash) public inState(States.Active) stateChange() returns (bool) {
    require(
      signatureState[msg.sender] == SignatureState.Unsigned,
      "Unexpected signature"
    );
    if (_hash != getLastUnsignedHash()) {
      resetSignatures();
      unsignedHash.push(_hash);
    }
    signatureState[msg.sender] = SignatureState.Signed;
    emit SignHash(msg.sender, _hash);
    if (allSignaturesInState(SignatureState.Signed)) {
      confirmTreatyText();
      return true;
    }
    return false;
  }  
  
  function makeBinding() public onlyBy(lawyerAddress) stateChange() {
    require(
      unsignedTreatyText.length == 0,
      "All treaty text must be signed before can be made binding"
    );
    treatyState = States.Binding;
    emit StateChange(States.Binding);
  }

  function undoBinding() public onlyBy(lawyerAddress) stateChange() {
    require(treatyState == States.Binding, "Treaty is not binding");
    treatyState = States.Active;
    emit StateChange(States.Active);
  }

  function changeLawyer(address _newLawyer)
    public
    onlyBy(lawyerAddress)
    stateChange()
  {
    lawyerAddress = _newLawyer;
    emit ChangeLawyer(_newLawyer);
  }

  function withdrawFromTreaty()
    public
    inEitherState(States.Active, States.Broken)
    stateChange()
  {
    signatureState[msg.sender] = SignatureState.Withdrawn;
    treatyState = States.Broken;
    emit WithdrawnFromTreaty(msg.sender);
    emit StateChange(States.Broken);

    if (allPartiesWithdrawn()) {
      emit MutuallyWithdrawn();
      treatyState = States.MutuallyWithdrawn;
    }
  }
  
  function calcSHA3(bytes memory _bytes) public pure returns (bytes32) {
    return keccak256(_bytes);
  }

  /////////////////
  // Getters
  ////////////////

  function getSignersAsText() public view returns (string memory) {
    string memory result = "";
    for (uint256 i = 0; i < signatureList.length; i++) {
      result = StringUtils.strConcat(
        result,
        StringUtils.toString(signatureList[i]),
        " | "
      );
    }
    return result;
  }

  function getNumSignatures() public view returns (uint256) {
    return signatureList.length;
  }

  function getUnsignedTreatyText(uint256 _index)
    public
    view
    returns (string memory treatyText)
  {
    if (unsignedTreatyText.length == 0) {
      return "No text";
    }
    return unsignedTreatyText[_index];
  }

  function getSignedTreatyText(uint256 _index)
    public
    view
    returns (string memory treatyText)
  {
    if (signedTreatyText.length == 0) return "No text";
    return signedTreatyText[_index];
  }

  function getNumUnsigned() public view returns (uint256) {
    return unsignedTreatyText.length;
  }

  function getNumSigned() public view returns (uint256) {
    return signedTreatyText.length;
  }


  /////////////
  // Internal Functions
  ////////////

  function resetSignatures() internal {
    for (uint256 i = 0; i < signatureList.length; i++) {
      signatureState[signatureList[i]] = SignatureState.Unsigned;
    }
  }

  function allSignaturesInState(SignatureState _state)
    internal
    view
    returns (bool)
  {
    bool result = true;
    for (uint256 i = 0; i < signatureList.length; i++) {
      if (signatureState[signatureList[i]] != _state) {
        result = false;
      }
    }
    return result;
  }

  function deleteUnsignedTreatyText() internal {
    delete unsignedTreatyText;
    emit UnsignedTreatyTextDeleted();
  }

  function allPartiesWithdrawn() internal view returns (bool) {
    return allSignaturesInState(SignatureState.Withdrawn);
  }

  function confirmTreatyText() internal {
    for (uint256 i = 0; i < unsignedTreatyText.length; i++) {
      signedTreatyText.push(unsignedTreatyText[i]);
      delete unsignedTreatyText[i];
    }
    for (uint256 i = 0; i < unsignedHash.length; i++) {
      signedHash.push(unsignedHash[i]);
      delete unsignedHash[i];
    }
    for (uint256 i = 0; i < signatureList.length; i++) {
      signatureState[signatureList[i]] = SignatureState.Unsigned;
    }
    unsignedTreatyText.length = 0;
    unsignedHash.length = 0;
    emit SignedByAll(address(this));
  }

  function isSignedByAll() internal view returns (bool) {
    return allSignaturesInState(SignatureState.Signed);
  }

  function getLastUnsignedText() public view returns (string memory) {
    if (unsignedTreatyText.length == 0) {
      return "No unsigned text";
    }
    return unsignedTreatyText[unsignedTreatyText.length - 1];
  }  

  function getLastSignedText() public view returns (string memory) {
    if (signedTreatyText.length == 0) {
      return "No signed text";
    }
    return signedTreatyText[signedTreatyText.length - 1];
  }

  function getLastUnsignedHash() public view returns (bytes32) {
    if (unsignedHash.length == 0) {
      return bytes32(0x0);
    }
    return unsignedHash[unsignedHash.length - 1];
  }

  function getLastSignedHash() public view returns (bytes32) {
    if (signedHash.length == 0) {
      return bytes32(0x0);
    }
    return signedHash[signedHash.length - 1];
  }
}
