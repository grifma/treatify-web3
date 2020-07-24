pragma solidity ^0.5.16;

import "./AccessRestriction.sol";

contract TreatyIndex is AccessRestriction {
  address[] public treatyIndex;
  string public indexName;

  event AddTreaty(address indexed _treatyAddress);
  event DeleteTreaty(address indexed _treatyAddress);
  event Rename(string indexed _oldName, string indexed _newName);

  constructor(string memory _indexName) public {
    indexName = _indexName;
  }

  function getNumTreaties() public view returns (uint256) {
    return treatyIndex.length;
  }

  function rename(string memory _indexName) public onlyBy(owner) {
    string memory oldName = indexName;
    indexName = _indexName;
    emit Rename(oldName, _indexName);
  }

  function addTreaty(address _treatyAddress) public {
    treatyIndex.push(_treatyAddress);
    emit AddTreaty(_treatyAddress);
  }

  function deleteTreaty(uint256 _indexToDelete) public onlyBy(owner) {
    address addressToDelete = treatyIndex[_indexToDelete];
    address addressToMove = treatyIndex[treatyIndex.length - 1];
    treatyIndex[_indexToDelete] = addressToMove;
    treatyIndex[treatyIndex.length - 1] = address(0);
    treatyIndex.length--;
    emit DeleteTreaty(addressToDelete);
  }

  function getTreatyIndex() public view returns (address[] memory) {
    return treatyIndex;
  }
}
