pragma solidity ^0.5.16;

import "./AccessRestriction.sol";

contract Lockable is AccessRestriction {
		
	uint256 public creationTime = now;
	uint256 public lockAt = now;
	uint256 public releaseAt = now;
	bool public locked = false;
	uint256 public lastStateChange = now;
	
	event Locked(uint256 _lockTime);
	event UnLocked();
	
	modifier stateChange() {
		require(getLocked() == false, "Must be unlocked");
		_;
		lastStateChange = now;
	}

	function okToUnlock() public view returns (bool ok) {
		if (now >= releaseAt) {
			return true;
		} else {
			return false;
		}
	}

	function lockFor(uint256 _lockTime) public stateChange onlyBy(owner) {
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
		
}