import { combineReducers } from "redux";
import {
  LOAD_TREATIES_IN_PROGRESS,
  LOAD_TREATIES_SUCCESS,
  LOAD_TREATIES_FAILURE,
  CREATE_TREATY,
  REMOVE_TREATY,
  MARK_ACTIVE,
  SIGN_TREATY,
  ADD_TEXT_TO_TREATY,
  LOAD_ONE_TREATY,
  LOAD_3BOX,
  OPEN_SPACE,
} from "../redux/actions";

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
  //console.log("[contract reducer] state:");
  //console.log(state);
  //console.log("action type: " + action.type);
  // //console.log(JSON.decycle(action));
  switch (action.type) {
    case "CONTRACT_LOADED":
      return { ...state, contract: action.contract };
    case "TREATY_INDEX_CONTRACT_LOADED":
      return { ...state, treatyIndexContract: action.treatyIndexContract };
    case "TREATY_CONTRACT_LOADED":
      return {
        ...state,
        treatyContracts: state.treatyContracts.concat(action.treatyContract),
      };
    case "VALUE_LOADED":
      return { ...state, value: action.value };
    case "TREATY_INDEX_LOADED":
      return { ...state, treatyIndex: action.treatyIndex };
    default:
      return state;
  }
}

export const treaties = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_TREATY: {
      const { treaty } = payload;
      return {
        ...state,
        data: state.data.concat(treaty),
      };
    }
    case REMOVE_TREATY: {
      const { treaty: treatyToRemove } = payload;
      return {
        ...state,
        data: state.data.filter((treaty) => treaty.id !== treatyToRemove.id),
      };
    }
    case MARK_ACTIVE: {
      //console.log("detected mark_active event");
      const { treaty: activeTreaty } = payload;
      //console.log("payload is " + payload);
      //console.log("deconstructed payload is " + activeTreaty);
      return {
        ...state,
        data: state.data.map((treaty) => {
          if (treaty.id === activeTreaty.id) {
            // return { ...treaty, isActive: true, treaty. }
            return Object.assign(activeTreaty, { status: "Active" });
          }
          return treaty;
        }),
      };
    }
    case SIGN_TREATY: {
      const { treaty: signedTreaty } = payload;
      return {
        ...state,
        data: state.data.map((treaty) => {
          if (treaty.id === signedTreaty.id) {
            return signedTreaty;
          } else {
            return treaty;
          }
        }),
      };
    }
    case ADD_TEXT_TO_TREATY: {
      const { treaty: updatedTreaty } = payload;
      return {
        ...state,
        data: state.data.map((treaty) => {
          if (treaty.id === updatedTreaty.id) {
            return updatedTreaty;
          }
          return treaty;
        }),
      };
    }

    case LOAD_TREATIES_SUCCESS: {
      const { treaties } = payload;
      //console.log(treaties);
      return {
        ...state,
        isLoading: false,
        data: treaties,
      };
    }
    case LOAD_TREATIES_IN_PROGRESS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_TREATIES_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case LOAD_ONE_TREATY: {
      const { treaty: loadedTreaty } = payload;
      return {
        ...state,
        data: state.data.map((treaty) => {
          if (treaty.id == loadedTreaty.id) {
            return loadedTreaty;
          } else {
            return treaty;
          }
        }),
      };
    }
    default:
      return state;
  }
};

export const threebox = (state = [], action) => {
  const { type, payload } = action;
  //console.log("[threebox reducer] payload", payload);
  switch (type) {
    case LOAD_3BOX: {
      const { box } = payload;
      return {
        ...state,
        threebox: threebox,
      };
    }
    case OPEN_SPACE: {
      const { space } = payload;
      return {
        ...state,
        openSpace: space,
        // openSpace: state.openSpace == null ? [space] : state.openSpace.concat(space),
        //todo: load the treaty text once the space is open
      };
    }
    default:
      return state;
  }
};

const rootReducer = new combineReducers({
  web3,
  contract,
  treaties,
  threebox,
});

export default rootReducer;

// treatyContracts == undefined
//   ? action.treatyContracts
//   : treatyContracts.push(action.treatyContracts),
