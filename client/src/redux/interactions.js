import getWeb3 from "../getWeb3";
import {
  web3Loaded,
  contractLoaded,
  accountLoaded,
  valueLoaded,
  treatyIndexContractLoaded,
  treatyContractLoaded,
  treatyIndexLoaded,
} from "./actions";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import TreatyIndexContract from "../contracts/TreatyIndex.json";
import TreatyContract from "../contracts/Treaty.json";

// export const loadWeb3 = () => async (dispatch) => {
//   console.log("==loadWeb3==");
//   console.log("==dispatch==");
//   console.log(dispatch);
//   // console.log("getState");
//   // console.log(getState);
//   const web3 = await getWeb3();
//   dispatch(web3Loaded(web3));
//   return web3;
// };
export const loadWeb3 = async (dispatch) => {
  console.log(dispatch);
  const web3 = await getWeb3();
  dispatch(web3Loaded(web3));
  return web3;
};

export const loadAccount = async (dispatch, web3) => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(accountLoaded(account));
  return account;
};

export const loadContract = async (dispatch, web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SimpleStorageContract.networks[networkId];
  const instance = new web3.eth.Contract(
    SimpleStorageContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  dispatch(contractLoaded(instance));
  return instance;
};

export const loadTreatyIndexContract = async (dispatch, web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = TreatyIndexContract.networks[networkId];
  const instance = new web3.eth.Contract(
    TreatyIndexContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  dispatch(treatyIndexContractLoaded(instance));
  return instance;
};

export const loadTreatyContract = async (dispatch, web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = TreatyContract.networks[networkId];
  const instance = new web3.eth.Contract(
    TreatyContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  dispatch(treatyContractLoaded(instance));
  return instance;
};

export const loadTreatyIndex = async (dispatch, contract) => {
  const treatyIndex = await contract.methods.getTreatyIndex().call();
  dispatch(treatyIndexLoaded(treatyIndex));
  return treatyIndex;
};

export const loadStoredData = async (dispatch, contract) => {
  const value = await contract.methods.get().call();
  dispatch(valueLoaded(value));
  return value;
};

// export const refreshTreaties = async (dispatch, contract) => {
//   const
