import { get } from "lodash";
import { createSelector } from "reselect";

//todo: Selector consistency

//ALL STATE
//export const getState = (state) => get(state);

// WEB3
const web3 = (state) => get(state, "web3.connection", null);
export const web3Selector = createSelector(web3, (w) => w);

const account = (state) => get(state, "web3.account", null);
export const accountSelector = createSelector(account, (a) => a);

//ETHERS
const ethersProvider = (state) => get(state, "ethers.provider", null);
export const ethersProviderSelector = createSelector(
  ethersProvider,
  (ep) => ep
);

const ethersSigner = (state) => get(state, "ethers.signer", null);
export const ethersSignerSelector = createSelector(ethersSigner, (es) => es);

//TREATY
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
  return get(state, "contract.treatyIndex", null);
};
export const treatyIndexSelector = createSelector(treatyIndex, (a) => a);

//TREATIES
export const getTreaties = (state) => get(state, "treaties.data");
export const getTreatiesLoading = (state) => get(state, "treaties.isLoading");

export const getDraftTreaties = createSelector(getTreaties, (treaties) =>
  treaties == undefined
    ? []
    : treaties.filter((treaty) => treaty.status == "Draft")
);

export const getActiveTreaties = createSelector(getTreaties, (treaties) =>
  treaties == undefined
    ? []
    : treaties.filter((treaty) => treaty.status == "Active")
);

export const getBindingTreaties = createSelector(getTreaties, (treaties) =>
  treaties == undefined
    ? []
    : treaties.filter((treaty) => treaty.status == "Binding")
);

export const getMutuallyWithdrawnTreaties = createSelector(
  getTreaties,
  (treaties) =>
    treaties == undefined
      ? []
      : treaties.filter((treaty) => treaty.status == "MutuallyWithdrawn")
);

export const getBrokenTreaties = createSelector(getTreaties, (treaties) =>
  treaties == undefined
    ? []
    : treaties.filter((treaty) => treaty.status == "Broken")
);

//3box

const threebox = (state) => {
  return get(state, "threebox.threebox", null);
};
export const threeboxSelector = createSelector(threebox, (a) => a);

const openSpace = (state) => {
  return get(state, "threebox.openSpace", null);
};
export const openSpaceSelector = createSelector(openSpace, (a) => a);
