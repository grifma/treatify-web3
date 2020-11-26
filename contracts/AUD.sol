pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

/// Sample ERC20 for testing

contract AUD is ERC20Mintable, ERC20Detailed {
    
    constructor() public ERC20Detailed("AUD", "AUD", 2) {
        
    }
    
}