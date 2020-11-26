/*

Treaties with the Distribute plugin, can agree on a % split.

Any funds sent to the contract, for example ticket sales, will be allocated based on the agreed upon % split.

Allocated funds can then be withdrawn.

*/

pragma solidity ^0.5.16;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Distribute {
    using SafeMath for uint256;
    bool mutex = false;
    mapping(address => uint256) public split;
    mapping(address => mapping (address => uint256)) public tokenAllocations;
    mapping(address => uint256) public ethAllocations;
    address[] public accounts;
    uint256 constant splitDecimals = 4;
    address hostAgreement;
    
    event SetSplit(uint[] _split);
    event Allocated(uint _index, address _account, uint _amount);
    event AllocatedToken(address _tokenAddress, uint _index, address _account, uint _amount);
    event Withdraw(uint _amount);
    event WithdrawToken(address _token, uint _amount);
    event AddAccount(address _account);
    event Received(uint _amount);

    modifier preventRecursion() {
        if (mutex == false) {
            mutex = true;
            _;
            mutex = false;
        }
    }
    
    modifier requiresAgreement() {
        require(msg.sender == hostAgreement, "Can only be called by the host agreement");
        _;
    }
    
    // constructor(address _hostAgreement) public {
    //     if (_hostAgreement == address(0)){
    //         hostAgreement = msg.sender;
    //     } else {
    //         hostAgreement = _hostAgreement;
    //     }
    // }
    
    constructor() public {
        hostAgreement = msg.sender;
    }
    
    /// Add a new account for distribution of incoming funds
    
    function addAccount(address _account) public requiresAgreement returns (uint256) {
        accounts.push(_account);
        emit AddAccount(_account);
        return accounts.length;
    }
    
    /// Set a new split ratio for distributing funds
    
    function setSplit(uint[] memory _split) public requiresAgreement {
        require(_split.length == accounts.length, "Input size must match number of accounts");
        uint sum;
        for(uint i=0; i<_split.length; i++) {
            split[accounts[i]] = _split[i];
            sum += _split[i];
        }
        require(sum == 100 * 10 ** splitDecimals, "Split must total 100");
        emit SetSplit(_split);
    }
    
    /// Automatically distribute incoming funds

    function() external payable {
        emit Received(msg.value);
        if (msg.value > 0) {
            allocateAccounts();
        }
    }
    
    function allocateAccounts() internal {
        for(uint i=0; i<accounts.length; i++) {
            uint thisAllocation = msg.value * split[accounts[i]] / 10 ** splitDecimals;
            ethAllocations[accounts[i]] += thisAllocation;
            emit Allocated(i, accounts[i], thisAllocation);
        }
    }
    
    /// Simulate how incoming funds would be distributed
    
    function simulateDeposit(uint _value) public {
        for(uint i=0; i<accounts.length; i++) {
            uint thisAllocation = _value * split[accounts[i]] / 10 ** splitDecimals;
            emit Allocated(i, accounts[i], thisAllocation);
        }
    }
    
    /// Withdraw ether or token balance

    function withdraw(uint256 _amount) public preventRecursion returns (uint256) {
        require(
            ethAllocations[msg.sender] >= _amount,
            "Insufficient balance"
        );
        msg.sender.transfer(_amount);
        emit Withdraw(_amount);
        return ethAllocations[msg.sender];   // Return remaining balance
    }

    function withdrawMax() public preventRecursion returns (uint256) {
        uint max = ethAllocations[msg.sender];
        msg.sender.transfer(max);
        ethAllocations[msg.sender] -= max;
        emit Withdraw(max);
        return ethAllocations[msg.sender];   // Return remaining balance
    }
    
    function withdrawToken(address _tokenAddress, uint _amount) public preventRecursion returns (uint256) {
        require(
            tokenAllocations[_tokenAddress][msg.sender] >= _amount,
            "Insufficient balance"
        );
        IERC20(_tokenAddress).transfer(msg.sender, _amount);
        tokenAllocations[_tokenAddress][msg.sender] -= _amount;
        emit WithdrawToken(_tokenAddress, _amount);
        return tokenAllocations[_tokenAddress][msg.sender];   // Return remaining balance
    }
    
    /// Check sender balance
    
    function checkBalance() public view returns (uint256) {
        return ethAllocations[msg.sender];
    }
    
    function checkTokenBalance(address _tokenAddress) public view returns (uint256) {
        return tokenAllocations[_tokenAddress][msg.sender];
    }    
    
    /// Manual ERC20 distribution for tokens that do not support ERC777
    
    function manualERC20Distribution(address _tokenAddress) public returns (uint256) {
        for(uint i=0; i<accounts.length; i++) {
            uint thisAllocation = IERC20(_tokenAddress).balanceOf(address(this)) * split[accounts[i]] / 10 ** splitDecimals;
            tokenAllocations[_tokenAddress][accounts[i]] += thisAllocation;
            emit AllocatedToken(_tokenAddress, i, accounts[i], thisAllocation);
        }
    }
    
    /// Balances held by this contract:

    function getHeldBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
     function getHeldTokenBalance(address _tokenAddress) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }  

    /// Getter convenience functions
    
    function getSplit(uint _index) public view returns (uint256) {
        return split[accounts[_index]];
    }
}
