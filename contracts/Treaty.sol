pragma solidity ^0.5.16;

import "./AccessRestriction.sol";
import "./StringUtils.sol";

contract Treaty is AccessRestriction {
  /// Constants ///
  States constant INITIAL_STATE = States.Draft;

  /// Treaty info ///
  uint256 public id;
  string public name;

  /// Treaty state ///
  States public treatyState = INITIAL_STATE;
  mapping(address => SignatureState) public signatureState;

  /// Agreement text (plain or hashed) ///
  string[] public unsignedTreatyText;
  string[] public signedTreatyText;

  /// Addresses ///
  address[] public signatureList;
  address public lawyerAddress;

  /// Locking ///
  uint256 public creationTime = now;
  uint256 public lockAt = now;
  uint256 public releaseAt = now;
  bool public locked = false;
  uint256 public lastStateChange = now;

  /// Enums ///
  enum States { Draft, Active, Binding, Broken, MutuallyWithdrawn }
  enum SignatureState { Unsigned, Signed, Withdrawn, Broken }
  enum TreatyType { ProjectToFounder, ProjectToMentor, Volunteer }

  /// Events ///
  event Locked(uint256 _lockTime);
  event UnLocked();
  event SignedBy(address indexed _signer);
  event SignedByAll(address indexed _treatyAddress);
  event WithdrawnFromTreaty(address indexed _signer);
  event MutuallyWithdrawn();
  event StateChange(States _newState);
  event UnsignedTreatyTextDeleted();
  event ChangeLawyer(address indexed _lawyerAddress);
  event WriteToTreaty(string indexed _text);
  event MakeActive(address indexed _treatyAddress);
  event RegisterAsSigner(address _signer);

  /// Modifiers ///
  modifier inState(States _state) {
    require(treatyState == _state, "Treaty is not in expected state");
    _;
  }

  modifier inEitherState(States _state1, States _state2) {
    require(
      treatyState == _state1 || treatyState == _state2,
      "Treaty is not in expected state"
    );
    _;
  }

  modifier stateChange() {
    require(getLocked() == false, "Treaty must be unlocked");
    _;
    lastStateChange = now;
  }

  constructor(
    uint256 _id,
    string memory _name,
    string memory _initialText
  ) public {
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

  function calcSHA3(bytes memory _bytes) public pure returns (bytes32) {
    return keccak256(_bytes);
  }

  function signTreaty() public inState(States.Active) stateChange() {
    signatureState[msg.sender] = SignatureState.Signed;
    emit SignedBy(msg.sender);

    if (allSignaturesInState(SignatureState.Signed)) {
      confirmTreatyText();
    }
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

  //////////////
  // Locking
  //////////////

  function okToUnlock() public view returns (bool ok) {
    if (now >= releaseAt) {
      return true;
    } else {
      return false;
    }
  }

  function lockFor(uint256 _lockTime) public stateChange {
    locked = true;
    lockAt = now;
    releaseAt = now + _lockTime;
    emit Locked(_lockTime);
  }

  function lockForMonths(uint256 _months) public stateChange {
    lockForDays(_months * 30);
  }

  function lockForDays(uint256 _days) public stateChange onlyBy(owner) {
    lockFor(_days * 24 * 60 * 60);
  }

  function getLocked() public returns (bool) {
    if (locked && okToUnlock()) {
      locked = false;
    }
    return locked;
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
    for (uint256 i = 0; i < signatureList.length; i++) {
      signatureState[signatureList[i]] = SignatureState.Unsigned;
    }
    unsignedTreatyText.length = 0;
    emit SignedByAll(address(this));
  }

  function isSignedByAll() internal view returns (bool) {
    return allSignaturesInState(SignatureState.Signed);
  }
}
