import getWeb3 from "../getWeb3";
import {
  web3Loaded,
  contractLoaded,
  accountLoaded,
  valueLoaded,
  treatyIndexContractLoaded,
  treatyContractLoaded,
  treatyIndexLoaded,
  loadTreatiesInProgress,
  loadTreatiesFailure,
  loadTreatiesSuccess,
  removeTreaty,
  createTreaty,
  markActive,
  addTextToTreaty,
  signTreaty,
} from "../redux/actions";
import {
  humanReadableTreatyStatus,
  humanReadableSignatureStatus,
  humanReadableTreatyType,
} from "../utility/enumMappings";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import TreatyIndexContract from "../contracts/TreatyIndex.json";
import TreatyContract from "../contracts/Treaty.json";

const treatyServer = "http://localhost:8081";

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

// export const addTreatyRequest = text => async dispatch => {
// export const loadWeb3DirectDispatch = async () => {

export const loadWeb3DirectDispatch = () => async (dispatch) => {
  const web3 = await getWeb3();
  dispatch(web3Loaded(web3));
  return web3;
};

export const loadAccountDirectDispatch = (web3) => async (dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(accountLoaded(account));
  return account;
};

export const loadContractDirectDispatch = (web3) => async (dispatch) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SimpleStorageContract.networks[networkId];
  const instance = new web3.eth.Contract(
    SimpleStorageContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  dispatch(contractLoaded(instance));
  return instance;
};

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

export const loadTreatyIndexContractDirectDispatch = (web3) => async (
  dispatch
) => {
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

export const loadTreatyIndexDirectDispatch = (contract) => async (dispatch) => {
  const treatyIndex = await contract.methods.getTreatyIndex().call();
  dispatch(treatyIndexLoaded(treatyIndex));
  return treatyIndex;
};

export const loadStoredData = (contract) => async (dispatch) => {
  const value = await contract.methods.get().call();
  dispatch(valueLoaded(value));
  return value;
};

// export const refreshTreaties = async (dispatch, contract) => {
//   const
//take the list of treaty address from treaty index, and then
// load the treaty smart contract at each of those addresses
//nb: consider replacing with just one smart contract to save gas.
//todo better to get web3, treatyindex from getState
export const loadTreatiesWeb3 = (web3, treatyIndex) => async (
  dispatch,
  getState
) => {
  try {
    if (web3 == null && treatyIndex == null) {
      console.log("-----------web3, treatyIndex-------------");
      const { web3 } = getState("web3");
      console.log(web3);
      const { treatyIndex } = getState("contract");
      console.log(treatyIndex);
      console.log("-----------web3, treatyIndex-------------");
    }
    console.log("load treaties web3!!");
    dispatch(loadTreatiesInProgress());
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = TreatyContract.networks[networkId];

    const treatyInstances = treatyIndex.map((treatyAddress) => {
      return new web3.eth.Contract(TreatyContract.abi, treatyAddress);
    });

    console.log("treatyInstances");
    console.log(treatyInstances);
    console.log(
      "next step is to translate this to the same as what web2 treatify is expecting"
    );
    // const treaties = treatyInstances;

    console.log("===++===");
    console.log(treatyInstances[0]);
    console.log(await treatyInstances[0]);
    console.log(await treatyInstances[0].methods.name().call());

    //how to do when there is array?
    console.log("array---");
    console.log(treatyInstances[0].methods.signedTreatyText);

    const treaties = await Promise.all(
      treatyInstances.map(async (treatyInstance) => {
        console.log("treatyInstance");
        console.log(treatyInstance);
        return {
          id: await treatyInstance.methods.id().call(),
          text: await treatyInstance.methods.name().call(),
          isCompleted: (await treatyInstance.methods.treatyState().call()) == 1,
          createdAt: await treatyInstance.methods.creationTime().call(),
          status: humanReadableTreatyStatus(
            await treatyInstance.methods.treatyState().call()
          ),
          unsignedTreatyText: ["UNSIGNED TEXT"], //treatyInstance.methods.unsignedTreatyText.call(),
          signedTreatyText: ["SIGNED TEXT"], //treatyInstance.methods.signedTreatyText.call(),
          address: await treatyInstance._address,
          contractInstance: treatyInstance,
        };
      })
    );
    // const treaties = treatyInstances.map(async (treatyInstance) => {
    //   return {
    //     id: await treatyInstance.methods.id.call().valueOf(),
    //     text: (await treatyInstance.methods.name.call()).valueOf(),
    //     isCompleted:
    //       (await treatyInstance.methods.treatyState.call().valueOf()) == 1,
    //     createdAt: await treatyInstance.methods.creationTime.call().valueOf(),
    //     status: await treatyInstance.methods.treatyState.call().valueOf(),
    //     unsignedTreatyText: ["UNSIGNED TEXT"], //treatyInstance.methods.unsignedTreatyText.call(),
    //     signedTreatyText: ["SIGNED TEXT"], //treatyInstance.methods.signedTreatyText.call(),
    //   };
    // });

    // const Promise.all(treatiesPromise)
    // const treaties = await treatiesPromises[0].valueOf();

    console.log("treaties 0");
    console.log(treaties[0]);
    console.log("treaties");
    console.log(treaties);
    // console.log(await treaties[0]);
    // console.log("await treaties");
    // console.log(await treaties);
    //for each treaty index, look up details from it treaty contract

    dispatch(loadTreatiesSuccess(treaties));
  } catch (e) {
    dispatch(loadTreatiesFailure());
    // dispatch(displayAlert(e));
    alert(e);
  }
};

export const loadTreaties = () => async (dispatch, getState) => {
  try {
    dispatch(loadTreatiesInProgress());
    const response = await fetch(`${treatyServer}/treaties`);
    const treaties = await response.json();
    dispatch(loadTreatiesSuccess(treaties));
  } catch (e) {
    dispatch(loadTreatiesFailure());
    dispatch(displayAlert(e));
  }
};

export const displayAlert = (text) => () => {
  alert(text);
};

export const markActiveRequest = (treaty, web3, treaties) => async (
  dispatch,
  getState
) => {
  const { id, address, contractInstance } = treaty;
  try {
    console.log("markActiveRequest");
    console.log("we have id:");
    console.log(id);
    console.log("we have address:");
    console.log(address);
    console.log("we have web3:");
    console.log(web3);
    console.log("we have treaties:");
    console.log(treaties);
    console.log("and we have el getState");
    console.log(getState("contract"));
    // const tx = await web3.

    const activeAccount = getState("web3").web3.account;
    console.log("activeAccount");
    console.log(activeAccount);

    const treaties = getState("treaties.data");
    console.log("treaties");
    console.log(treaties);

    // const myAddress = web3.account;
    //todo: better to retreive this instance from the state
    console.log(contractInstance.methods.makeActive);
    const tx = await contractInstance.methods
      .makeActive()
      .send({ from: activeAccount });
    console.log("tx");
    console.log(tx);

    activeTreaty = [];
    dispatch(loadTreatiesWeb3(null, null));
    // dispatch(markActive(activeTreaty));

    // const response = await fetch(`${treatyServer}/treaties/${id}/active`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "post",
    //   body: "",
    // });
    // const activeTreaty = await response.json();
    // console.log("active treaty is " + activeTreaty);
    // dispatch(markActive(activeTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};

export const addTreatyRequest = (dispatch, text) => async (dispatch) => {
  const body = JSON.stringify({ text });
  console.log("body:");
  console.log(body);
  try {
    const response = await fetch(`${treatyServer}/treaties`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: body,
    });
    const addedTreaty = await response.json();
    console.log("response.json");
    console.log(addedTreaty);
    dispatch(createTreaty(addedTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};

export const addTreatyTextRequest = (dispatch, id, text) => async (
  dispatch
) => {
  console.log(`add treaty text with id ${id}, text ${text}`);
  try {
    const response = await fetch(`${treatyServer}/treaties/${id}/text`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      method: "post",
    });
    const updatedTreaty = await response.json();
    console.log(updatedTreaty);
    dispatch(addTextToTreaty(updatedTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  }
};

export const removeTreatyRequest = (dispatch, id) => async (dispatch) => {
  try {
    console.log("remove treaty request");
    console.log(id);
    const response = await fetch(`http://localhost:8081/treaties/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
      method: "delete",
    });
    const removedTreaty = await response.json();
    console.log(removedTreaty);
    dispatch(removeTreaty(removedTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};

export const signTreatyRequest = (dispatch, id) => async (dispatch) => {
  try {
    const response = await fetch(`${treatyServer}/treaties/${id}/sign`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
      method: "post",
    });
    const signedTreaty = await response.json();
    dispatch(signTreaty(signedTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};
