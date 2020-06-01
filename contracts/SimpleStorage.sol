pragma solidity >=0.4.21 <0.7.0;


contract SimpleStorage {
    uint256 storedData;
    event Set(uint256);

    function set(uint256 x) public {
        storedData = x;
        emit Set(x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
