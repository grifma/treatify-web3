pragma solidity ^0.5.16;

contract AccessRestriction {

  address public owner = msg.sender;
  uint256 public creationTime = now;

  modifier onlyBy(address _account) {
    require(msg.sender == _account, "Sender not authorized.");
    _;
  }

  modifier onlyByAddresses(address _account1, address _account2) {
    require(
      msg.sender == _account1 || msg.sender == _account2,
      "Sender not authorized."
    );
    _;
  }

  function changeOwner(address _newOwner) public onlyBy(owner) {
    owner = _newOwner;
  }

  modifier onlyAfter(uint256 _time) {
    require(now >= _time, "Function called too early.");
    _;
  }

  function disown() public onlyBy(owner) {
    delete owner;
  }

  modifier costs(uint256 _amount) {
    require(msg.value >= _amount, "Not enough Ether provided.");
    _;
    if (msg.value > _amount) msg.sender.transfer(msg.value - _amount);
  }
}

// Example of delay restriction:
// function someFunction() public onlyBy(owner) onlyAfter(creationTime + 6 weeks) {}