import { loadAccount } from "./interactions";
import { loadTreatyIndex } from "./interactions";

export const subscribeToAccountsChanging = (dispatch, web3) => {
  window.ethereum.on("accountsChanged", async function (accounts) {
    await loadAccount(dispatch, web3);
  });
};
export const subscribeToNewTreaties = (dispatch, web3) => {
  window.ethereum.on("AddTreaty", async function (accounts) {
    await loadTreatyIndex(dispatch, web3);
  });
};
export const subscribeSet = (dispatch, web3) => {
  window.ethereum.on("Set", async function (accounts) {
    console.log("SUBSCRIBE--SET");
  });
};
