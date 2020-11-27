pragma solidity ^0.5.16;

contract TreatyStateMachine {
    
  enum States { Draft, Active, Binding, Broken, MutuallyWithdrawn }
  States constant INITIAL_STATE = States.Draft;
  States public treatyState = INITIAL_STATE;
    
  modifier inState(States _state) {
    require(treatyState == _state, "Treaty is not in expected state");
    _;
  }

  modifier inEitherState(States _state1, States _state2) {
    require(
      treatyState == _state1 || treatyState == _state2,
      "Not in expected state"
    );
    _;
  }
  


}