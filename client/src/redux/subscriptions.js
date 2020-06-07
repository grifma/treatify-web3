import { loadAccount, loadAccountDirectDispatch } from "./interactions";
import { loadTreatyIndex } from "./interactions";

export const subscribeToAccountsChanging = (web3) => async (dispatch) => {
  window.ethereum.on("accountsChanged", async function (accounts) {
    console.log("account changed");
    await dispatch(loadAccountDirectDispatch(web3));
  });
};
export const psubscribeToAccountsChanging = (web3) => async (dispatch) => {
  window.ethereum.on("accountsChanged", async function (accounts) {
    console.log("account changed");
    await loadAccount(dispatch, web3);
  });
};
export const subscribeToNewTreaties = (web3) => async (dispatch) => {
  window.ethereum.on("AddTreaty", async function (accounts) {
    await loadTreatyIndex(dispatch, web3);
  });
};
export const subscribeSet = (web3) => async (dispatch) => {
  window.ethereum.on("Set", async function (accounts) {
    console.log("SUBSCRIBE--SET");
  });
};
