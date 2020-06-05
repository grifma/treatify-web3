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
  joinTreaty,
  addToTreatyIndex,
} from "../redux/actions";
import {
  humanReadableTreatyStatus,
  humanReadableSignatureStatus,
  humanReadableTreatyType,
} from "../utility/enumMappings";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import TreatyIndexContract from "../contracts/TreatyIndex.json";
import TreatyContract from "../contracts/Treaty.json";
// import TreatyContractBinary from "../contracts/TreatyContractBinary.js";
import TreatyBin from "../contracts/TreatyBin.json";
import Web3 from "web3";
import { batch } from "react-redux";

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
  alert("using deprecated function.");
  console.log(dispatch);
  const web3 = await getWeb3();
  dispatch(web3Loaded(web3));
  return web3;
};

export const loadAccount = async (web3) => {
  alert("using deprecated function.");
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(accountLoaded(account));
  return account;
};

export const loadContract = async (web3) => {
  alert("using deprecated function.");
  alert("using deprecated function.");
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SimpleStorageContract.networks[networkId];
  const instance = new web3.eth.Contract(
    SimpleStorageContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  dispatch(contractLoaded(instance));
  return instance;
};

export const loadTreatyIndexContract = async (web3) => {
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

export const loadTreatyContract = (web3) => async (dispatch) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = TreatyContract.networks[networkId];
  const instance = new web3.eth.Contract(
    TreatyContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  dispatch(treatyContractLoaded(instance));
  return instance;
};

export const loadTreatyIndex = async (contract) => {
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

async function getUnsignedText(i) {
  await treatyInstance.methods.unsignedTreatyText(i).call();
}

async function getSignedText(i) {
  await treatyInstance.methods.signedTreatyText(i).call();
}

function getFor(numSigned, lookupFunction) {
  var result = [];
  for (let i = 0; i < numSigned; i++) {
    result.push(lookupFunction(i));
  }
  return result;
}
// export const refreshTreaties = async (contract) => {
//   const
//take the list of treaty address from treaty index, and then
// load the treaty smart contract at each of those addresses
//nb: consider replacing with just one smart contract to save gas.
//todo better to get web3, treatyindex from getState
export const loadTreatiesWeb3 = (/*web3, treatyIndex*/) => async (
  dispatch,
  getState
) => {
  //todo remove parameters and always get from state
  try {
    //   if (web3 == null) {
    //   }
    //   console.log("-----------web3, -------------");
    //   const { web3 } = getState("web3");
    //   console.log(web3);

    //   if (treatyIndex == null) {
    //     console.log("-----------treatyIndex-------------");
    //     const { treatyIndex } = getState("contract");
    //     console.log(treatyIndex);
    //   }
    //   console.log("-----------web3, -------------");
    //   console.log(web3);

    //   console.log("-----------treatyIndex-------------");
    //   console.log(treatyIndex);

    //   if (web3 == null || treatyIndex == null) {
    //     alert("This should not happen.");
    //   }

    // }
    console.log("start loadTreatiesWeb3");
    console.log("-----------web3, -------------");
    const web3 = getState().web3.connection;
    console.log(web3);

    console.log("-----------treatyIndex-------------");
    const treatyIndex = getState().contract.treatyIndex;
    console.log(treatyIndex);

    console.log("STATE");
    console.log(getState());
    if (web3 == null || treatyIndex == null) {
      alert("This should not happen.");
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
        const numUnsigned = treatyInstance.methods.getNumUnsigned.call();
        const numSigned = treatyInstance.methods.getNumSigned.call();
        return {
          id: await treatyInstance.methods.id().call(),
          text: await treatyInstance.methods.name().call(),
          isCompleted: (await treatyInstance.methods.treatyState().call()) == 1,
          createdAt: await treatyInstance.methods.creationTime().call(),
          status: humanReadableTreatyStatus(
            await treatyInstance.methods.treatyState().call()
          ),

          unsignedTreatyText: getFor(numUnsigned, getUnsignedText),
          signedTreatyText: getFor(numSigned, getSignedText),
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
    console.log("Exception in loadTreatiesWeb3");
    console.log(e);
    dispatch(loadTreatiesFailure());
    dispatch(displayAlert(e));
    // alert(e);
  }
};

export const loadTreaties = () => async (getState) => {
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

export const markActiveRequest = (treaty) => async (dispatch, getState) => {
  const { id, address, contractInstance } = treaty;
  const currentAccount = getState().web3.account;
  try {
    const tx = await contractInstance.methods
      .makeActive()
      .send({ from: currentAccount });
    console.log("tx");
    console.log(tx);

    //todo instead of updating the treaty, now we just trigger a complete reload. good enough for now.
    //activeTreaty = [];
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

export const joinTreatyRequest = (treaty) => async (dispatch, getState) => {
  console.log("joinRequest for");
  console.log(treaty);
  const { id, address, contractInstance } = treaty;
  const currentAccount = getState().web3.account;
  try {
    const tx = await contractInstance.methods
      .registerAsSigner()
      .send({ from: currentAccount });
    console.log("tx");
    console.log(tx);

    dispatch(joinTreaty(treaty));
    //todo instead of updating the treaty, now we just trigger a complete reload. good enough for now.
    //activeTreaty = [];
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

export const addTreatyRequest = (text) => async (dispatch, getState) => {
  try {
    console.log(`The given provider is ${Web3.givenProvider}`);
    console.log(`The current provider is ${Web3.currentProvider}`);
    var freshWeb3 = new Web3(Web3.givenProvider);
    console.log("freshWeb3");
    console.log(freshWeb3);

    const treatyContract1 = web3.eth.contract(TreatyContract.abi);
    console.log(treatyContract1);

    const currentAccount = getState("web3").web3.account;
    console.log("current account is " + currentAccount);
    const contractCode = "0x" + TreatyBin.bin;
    const id = Math.floor(Math.random() * 10 ** 3);
    const name = text;
    const initialText = text;

    const parameters = TreatyContract.abi;
    console.log(`[method3] About to deploy  ${text} . . .`);

    //method 4

    var _id = Math.floor(Math.random() * 10 ** 3);
    var _name = text;
    var _initialText = "Initial text for " + text;

    const deployedTreaty = await treatyContract1.new(
      _id,
      _name,
      _initialText,
      {
        from: currentAccount,
        data: "0x" + TreatyBin.bin,
        gas: "4700000",
      },
      function (e, contract) {
        console.log(e, contract);
        if (typeof contract.address !== "undefined") {
          console.log(
            "Contract mined! address: " +
              contract.address +
              " transactionHash: " +
              contract.transactionHash
          );

          dispatch(addToTreatyIndexRequest(contract, contract.address));
        }
      }
    );
    // //at this point the contract is not mined yet, so values will not be defined
    // console.log("deployedTreaty");
    // console.log(deployedTreaty);
    // console.log("await deployedTreaty");
    // console.log(await deployedTreaty);
    // console.log("address: " + (await deployedTreaty.address));
    // console.log("transactionHash: " + (await deployedTreaty.address));

    // const dummyTreaty = { x: "hello" };
    // //now add it to the treaty index
    // // console.log("addToTreatyIndexRequest");
    // // console.log(addToTreatyIndexRequest(dummyTreaty));
    // console.log("dispatch(addToTreatyIndexRequest");
    // console.log(
    //   dispatch(addToTreatyIndexRequest(dummyTreaty, deployedTreaty.address))
    // );

    //now refresh the whole thing.
    //(or ideally, just add the contract)

    // console.log("Preparing to deploy the contract");
    // const web3Connection = getState("web3").web3.connection;
    // console.log("web3Connection");
    // console.log(web3Connection);
    // const x = getState("contract");
    // console.log("contract from state");
    // console.log(x);
    // const contracts = getState("contract").contract;
    // console.log("contract.contract from state");
    // console.log(contracts);
    // // console.log("contracts");
    // // console.log(contracts);
    // console.log("web3.account");
    // console.log(web3.account);
    // // const abi = JSON.parse(TreatyContract.abi);
    // const abi = TreatyContract.abi;
    // console.log(abi);
    // const contractCode = "0x" + TreatyBin.bin;
    // console.log("Contract code is");
    // console.log(contractCode);

    // // const initialisedTreatyContract = web3Connection.eth.new(abi);
    // // console.log(initialisedTreatyContract);

    // dispatch(loadTreatiesWeb3(null, null));
    // const addedTreaty = await response.json();
    // console.log("response.json");
    // console.log(addedTreaty);
    // dispatch(createTreaty(addedTreaty));
  } catch (e) {
    console.log("[addTreatyRequest] ERROR");
    console.log(e);
    dispatch(displayAlert(e));
  } finally {
  }
};

export const addToTreatyIndexRequest = (treaty, address) => async (
  dispatch,
  getState
) => {
  console.log(`add treaty to index:`);
  console.log(treaty);
  console.log(`add treaty with address ${address}, to index`);
  try {
    console.log(getState(null));
    console.log(getState());
    console.log(getState("contract"));
    const currentAccount = getState(null).web3.account;
    const treatyIndexInstance = getState(null).contract.treatyIndexContract;
    console.log(treatyIndexInstance);

    const tx = await treatyIndexInstance.methods.addTreaty(address).send({
      from: currentAccount,
    });
    console.log("tx");
    console.log(tx);
    dispatch(loadTreatiesWeb3());
    dispatch(addToTreatyIndex(treaty));
  } catch (e) {
    console.log("[addToTreatyIndexRequest] ERROR");
    console.log(e);
    dispatch(displayAlert(e));
  }
};

export const addTreatyTextRequest = (id, text) => async (dispatch) => {
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

export const removeTreatyRequest = (id) => async (dispatch) => {
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

export const signTreatyRequest = (treaty) => async (dispatch, getState) => {
  console.log("signRequest for");
  console.log(treaty);
  const { id, address, contractInstance } = treaty;
  const currentAccount = getState().web3.account;
  try {
    const tx = await contractInstance.methods
      .signTreaty()
      .send({ from: currentAccount });
    console.log("tx");
    console.log(tx);

    dispatch(signTreaty(signedTreaty));
    dispatch(loadTreatiesWeb3(null, null));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};
