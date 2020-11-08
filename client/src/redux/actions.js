export function web3Loaded(connection) {
  return {
    type: "WEB3_LOADED",
    connection,
  };
}

export function ethersProviderLoaded(provider) {
  return {
    type: "ETHERS_PROVIDER_LOADED",
    provider,
  };
}

export function ethersSignerLoaded(signer) {
  return {
    type: "ETHERS_SIGNER_LOADED",
    signer,
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

export const HIDE_TREATIES = "HIDE_TREATIES";
export const hideTreaties = (ids) => ({
  type: HIDE_TREATIES,
  payload: { ids },
});

export const SHOW_ALL_TREATIES = "SHOW_ALL_TREATIES";
export const showAllTreaties = () => ({
  type: SHOW_ALL_TREATIES,
});

export const WEB3_LOADED = "WEB3_LOADED";
export const ACCOUNT_LOADED = "ACCOUNT_LOADED";
export const ETHERS_SIGNER_LOADED = "ETHERS_SIGNER_LOADED";
export const ETHERS_PROVIDER_LOADED = "ETHERS_PROVIDER_LOADED";
export const CONTRACT_LOADED = "CONTRACT_LOADED";
export const TREATY_INDEX_CONTRACT_LOADED = "TREATY_INDEX_CONTRACT_LOADED";
export const TREATY_CONTRACT_LOADED = "TREATY_CONTRACT_LOADED";
export const VALUE_LOADED = "VALUE_LOADED";
export const TREATY_INDEX_LOADED = "TREATY_INDEX_LOADED";
