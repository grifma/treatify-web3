import { get } from "lodash";
import { createSelector } from "reselect";

// WEB3
const web3 = (state) => get(state, "web3.connection", null);
export const web3Selector = createSelector(web3, (w) => w);

const account = (state) => get(state, "web3.account", null);
export const accountSelector = createSelector(account, (a) => a);

//CONTRACT
const contract = (state) => get(state, "contract.contract", null);
export const contractSelector = createSelector(contract, (a) => a);

const value = (state) => get(state, "contract.value", null);
export const valueSelector = createSelector(value, (a) => a);

const treatyIndexContract = (state) =>
  get(state, "contract.treatyIndexContract", null);
export const treatyIndexContractSelector = createSelector(
  treatyIndexContract,
  (a) => a
);

const treatyContract = (state, i) =>
  get(state, "contract.treatyContracts", i, null);
export const treatyContractSelector = createSelector(treatyContract, (a) => a);

const treatyContracts = (state) => get(state, "treatify.treatyContracts", null);
export const treatyContractsSelector = createSelector(
  treatyContracts,
  (a) => a
);

const treatyIndex = (state) => {
  console.log("treatyindexselector");
  console.log("state");
  console.log(state);
  return get(state, "contract.treatyIndex", null);
};
export const treatyIndexSelector = createSelector(treatyIndex, (a) => a);
