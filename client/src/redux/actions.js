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

export function contractLoaded(contract) {
  return {
    type: "CONTRACT_LOADED",
    contract,
  };
}

export function valueLoaded(value) {
  return {
    type: "VALUE_LOADED",
    value,
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
    contract,
  };
}

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

// export function
