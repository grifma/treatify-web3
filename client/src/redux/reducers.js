import { combineReducers } from "redux";
import { cycle } from "cycle";

function web3(state = {}, action) {
  switch (action.type) {
    case "WEB3_LOADED":
      return { ...state, connection: action.connection };
    case "ACCOUNT_LOADED":
      return { ...state, account: action.account };
    default:
      return state;
  }
}

function contract(state = {}, action) {
  console.log("[contract reducer] state:");
  console.log(state);
  console.log("action type: " + action.type);
  // console.log(JSON.decycle(action));
  switch (action.type) {
    case "CONTRACT_LOADED":
      return { ...state, contract: action.contract };
    case "TREATY_INDEX_CONTRACT_LOADED":
      return { ...state, treatyIndexContract: action.treatyIndexContract };
    case "TREATY_CONTRACT_LOADED":
      return {
        ...state,
        treatyContracts: action.treatyContracts,
      };
    case "VALUE_LOADED":
      return { ...state, value: action.value };
    case "TREATY_INDEX_LOADED":
      return { ...state, treatyIndex: action.treatyIndex };
    default:
      return state;
  }
}

const rootReducer = new combineReducers({
  web3,
  contract,
});

export default rootReducer;

// treatyContracts == undefined
//   ? action.treatyContracts
//   : treatyContracts.push(action.treatyContracts),
