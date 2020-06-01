pragma solidity ^0.5.16;

import "./AccessRestriction.sol";
import "./Treaty.sol";


contract TreatyIndex is AccessRestriction {
    address[] public treatyIndex;
    string public name;

    event AddTreaty(address _treatyAddress);

    constructor(string memory _name) public {
        name = _name;
    }

    function getNumTreaties() public view returns (uint256) {
        return treatyIndex.length;
    }

    function rename(string memory _name) public onlyBy(owner) {
        name = _name;
    }

    function addTreaty(address _treatyAddress) public onlyBy(owner) {
        treatyIndex.push(_treatyAddress);
        emit AddTreaty(_treatyAddress);
    }

    function deleteTreaty(uint256 _indexToDelete) public onlyBy(owner) {
        address keyToMove = treatyIndex[treatyIndex.length - 1];
        treatyIndex[_indexToDelete] = keyToMove;
        treatyIndex[treatyIndex.length - 1] = address(0);
        treatyIndex.length--;
    }

    function getTreatyIndex() public view returns (address[] memory) {
        return treatyIndex;
    }
}
