export function web3Loaded(connection) {
  return {
    type: "WEB3_LOADED",
    connection,
  };
}

export function accountLoaded(account) {
  return {
    type: "ACCOUNT_LOADED",
    account,
  };
}

export function treatyIndexLoaded(treatyIndex) {
  return {
    type: "TREATY_INDEX_LOADED",
    treatyIndex,
  };
}

export function treatyIndexContractLoaded(treatyIndexContract) {
  return {
    type: "TREATY_INDEX_CONTRACT_LOADED",
    treatyIndexContract,
  };
}

export function treatyContractLoaded(contract) {
  return {
    type: "TREATY_CONTRACT_LOADED",
    treatyContract,
  };
}

export const LOAD_TREATIES_IN_PROGRESS = "LOAD_TREATIES_IN_PROGRESS";
export function loadTreatiesInProgress() {
  return {
    type: LOAD_TREATIES_IN_PROGRESS,
  };
}

export const LOAD_TREATIES_SUCCESS = "LOAD_TREATIES_SUCCESS";
export function loadTreatiesSuccess(treaties) {
  return {
    type: LOAD_TREATIES_SUCCESS,
    payload: { treaties },
  };
}

export const LOAD_TREATIES_FAILURE = "LOAD_TREATIES_FAILURE";
export function loadTreatiesFailure() {
  return {
    type: LOAD_TREATIES_FAILURE,
  };
}

//these will not work because: Unhandled Rejection (Error): Actions must be plain objects. Use custom middleware for async actions.
// export const LOAD_TREATIES_IN_PROGRESS = "LOAD_TREATIES_IN_PROGRESS";
// export const loadTreatiesInProgress = () => ({
//   type: LOAD_TREATIES_IN_PROGRESS,
// });

// export const LOAD_TREATIES_SUCCESS = "LOAD_TREATIES_SUCCESS";
// export const loadTreatiesSuccess = (treaties) => ({
//   type: LOAD_TREATIES_SUCCESS,
//   payload: { treaties },
// });

// export const LOAD_TREATIES_FAILURE = "LOAD_TREATIES_FAILURE";
// export const loadTreatiesFailure = () => ({
//   type: LOAD_TREATIES_FAILURE,
// });

// export const loadTreaties = () => async (dispatch, getState) => {
//   try {
//     dispatch(loadTreatiesInProgress());
//     const response = await fetch(`${treatyServer}/treaties`);
//     const treaties = await response.json();
//     dispatch(loadTreatiesSuccess(treaties));
//   } catch (e) {
//     dispatch(loadTreatiesFailure());
//     dispatch(displayAlert(e));
//   }
// };

export const CREATE_TREATY = "CREATE_TREATY";
export const createTreaty = (treaty) => ({
  type: CREATE_TREATY,
  payload: { treaty },
});

export const REMOVE_TREATY = "REMOVE_TREATY";
export const removeTreaty = (treaty) => ({
  type: REMOVE_TREATY,
  payload: { treaty },
});

export const MARK_ACTIVE = "MARK_ACTIVE";
export const markActive = (treaty) => ({
  type: MARK_ACTIVE,
  payload: { treaty },
});

export const SIGN_TREATY = "SIGN_TREATY";
export const signTreaty = (treaty) => ({
  type: SIGN_TREATY,
  payload: { treaty },
});

export const JOIN_TREATY = "JOIN_TREATY";
export const joinTreaty = (treaty) => ({
  type: JOIN_TREATY,
  payload: { treaty },
});

export const ADD_TEXT_TO_TREATY = "ADD_TEXT_TO_TREATY";
export const addTextToTreaty = (treaty, text) => ({
  type: ADD_TEXT_TO_TREATY,
  payload: { treaty: treaty, text: text },
});

export const ADD_TO_TREATY_INDEX = "ADD_TO_TREATY_INDEX";
export const addToTreatyIndex = (treaty) => ({
  type: ADD_TO_TREATY_INDEX,
  payload: { treaty },
});

export const LOAD_ONE_TREATY_IN_PROGRESS = "LOAD_ONE_TREATY_IN_PROGRESS";
export const loadOneTreatyInProgress = (treaty) => ({
  type: LOAD_ONE_TREATY_IN_PROGRESS,
  payload: { treaty },
});

export const LOAD_ONE_TREATY_SUCCESS = "LOAD_ONE_TREATY_SUCCESS";
export const loadOneTreatySuccess = (treaty) => ({
  type: LOAD_ONE_TREATY_SUCCESS,
  payload: { treaty },
});

export const LOAD_ONE_TREATY_FAILURE = "LOAD_ONE_TREATY_FAILURE";
export const loadOneTreatyFailure = () => ({
  type: LOAD_ONE_TREATY_FAILURE,
});

export const LOAD_3BOX_IN_PROGRESS = "LOAD_3BOX_IN_PROGRESS";
export const load3boxInProgress = () => ({
  type: LOAD_3BOX_IN_PROGRESS,
});

export const LOAD_3BOX_SUCCESS = "LOAD_3BOX_SUCCESS";
export const load3boxSuccess = (box) => ({
  type: LOAD_3BOX_SUCCESS,
  payload: { box },
});

export const LOAD_3BOX_FAILURE = "LOAD_3BOX_FAILURE";
export const load3boxFailure = () => ({
  type: LOAD_3BOX_FAILURE,
});

export const OPEN_SPACE = "OPEN_SPACE";
export const openSpace = (space) => ({
  type: OPEN_SPACE,
  payload: { space },
});
