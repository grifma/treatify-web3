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
  LOAD_ONE_TREATY_IN_PROGRESS,
  LOAD_ONE_TREATY_SUCCESS,
  LOAD_ONE_TREATY_FAILURE,
  LOAD_3BOX_IN_PROGRESS,
  LOAD_3BOX_SUCCESS,
  LOAD_3BOX_FAILURE,
  OPEN_SPACE,
  WEB3_LOADED,
  ACCOUNT_LOADED,
  ETHERS_SIGNER_LOADED,
  ETHERS_PROVIDER_LOADED,
  CONTRACT_LOADED,
  TREATY_INDEX_CONTRACT_LOADED,
  TREATY_CONTRACT_LOADED,
  VALUE_LOADED,
  TREATY_INDEX_LOADED,
  HIDE_TREATIES,
  SHOW_ALL_TREATIES,
  LOAD_USER_CONFIG,
} from "../redux/actions";

function web3(state = {}, action) {
  switch (action.type) {
    case WEB3_LOADED:
      return { ...state, connection: action.connection };
    case ACCOUNT_LOADED:
      return { ...state, account: action.account };
    default:
      return state;
  }
}

function ethers(state = {}, action) {
  switch (action.type) {
    case ETHERS_SIGNER_LOADED:
      return { ...state, signer: action.signer };
    case ETHERS_PROVIDER_LOADED:
      return { ...state, provider: action.provider };
    default:
      return state;
  }
}

function contract(state = {}, action) {
  switch (action.type) {
    case CONTRACT_LOADED:
      return { ...state, contract: action.contract };
    case TREATY_INDEX_CONTRACT_LOADED:
      return { ...state, treatyIndexContract: action.treatyIndexContract };
    case TREATY_CONTRACT_LOADED:
      return {
        ...state,
        treatyContracts: state.treatyContracts.concat(action.treatyContract),
      };
    case VALUE_LOADED:
      return { ...state, value: action.value };
    case TREATY_INDEX_LOADED:
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
      const { treaty: activeTreaty } = payload;
      return {
        ...state,
        data: state.data.map((treaty) => {
          if (treaty.id === activeTreaty.id) {
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
          } else {
            return treaty;
          }
        }),
      };
    }

    case LOAD_TREATIES_SUCCESS: {
      const { treaties } = payload;
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
    case LOAD_ONE_TREATY_SUCCESS: {
      const { treaty: loadedTreaty } = payload;
      const treatyIdExists = (id, treatyList) => {
        return treatyList.filter((x) => x.id == id).length > 0;
      };
      console.log(`treatyIdExists? ${treatyIdExists}`);
      return {
        ...state,
        isOneTreatyLoading: false,
        data:
          //If treaty already exists, update it. Otherwise add it.
          (treatyIdExists(loadedTreaty.id, state.data) &&
            state.data.map((treaty) => {
              if (treaty.id == loadedTreaty.id) {
                return loadedTreaty;
              } else {
                return treaty;
              }
            })) ||
          state.data.concat(loadedTreaty),
      };
    }
    case LOAD_ONE_TREATY_FAILURE: {
      return {
        ...state,
        isOneTreatyLoading: false,
      };
    }
    case LOAD_ONE_TREATY_IN_PROGRESS: {
      return {
        ...state,
        isOneTreatyLoading: true,
      };
    }
    case HIDE_TREATIES: {
      console.log("[treaties reducer] HIDE_TREATIES");
      console.log("state :>> ", state);
      console.log("payload :>> ", payload);
      const { ids } = payload;
      console.log("ids :>> ", ids);
      return {
        ...state,
        data: state.data.map(treaty => {
          if (ids.indexOf(treaty.id) == -1) {
            return treaty;
          } else {
            return {
              ...treaty,
              hidden: true,
            }
          }
        })
      };
    }
    default:
      return state;
  }
};

export const config = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_USER_CONFIG: {
      console.log('LOAD_USER_CONFIG with payload :>> ', payload);
      console.log('payload.hiddenTreaties :>> ', payload.hiddenTreaties);
      console.log('payload.hiddenTreaties  || []:>> ', payload.hiddenTreaties || []);
      return {
        ...state,
        hiddenTreaties: payload.hiddenTreaties || []
      }
    }
    case HIDE_TREATIES: {
      console.log("HIDE_TREATIES");
      console.log("state :>> ", state);
      console.log("payload :>> ", payload);
      console.log("ids :>> ", ids);
      const { ids } = payload;
      const prevHiddenTreaties = state.hiddenTreaties || [];
      return {
        ...state,
        hiddenTreaties: prevHiddenTreaties.concat(ids),
        // hiddenTreaties:
        //   (state.config.hiddenTreaties == undefined && new Set(ids)) ||
        //   state.config.hiddenTreaties.concat(ids),
      };
    }
    case SHOW_ALL_TREATIES: {
      return {
        ...state,
        hiddenTreaties: [],
      };
    }
    default:
      return state;
  }
};

export const threebox = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_3BOX_IN_PROGRESS: {
      return {
        ...state,
        is3boxLoading: true,
      };
    }
    case LOAD_3BOX_SUCCESS: {
      const { box } = payload;
      return {
        ...state,
        threebox: threebox,
        is3boxLoading: false,
      };
    }
    case LOAD_3BOX_FAILURE: {
      return {
        ...state,
        is3boxLoading: false,
      };
    }
    case OPEN_SPACE: {
      const { space } = payload;
      return {
        ...state,
        openSpace: space,
      };
    }
    default:
      return state;
  }
};

const rootReducer = new combineReducers({
  web3,
  ethers,
  contract,
  treaties,
  threebox,
  config,
});

export default rootReducer;
