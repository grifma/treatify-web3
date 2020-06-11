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
  loadOneTreaty,
  load3box,
  openSpace,
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
import Box from "3box";
const debug = require("debug");
const debugParseTreaty = require("debug")("parseTreaty");
const debugLoadTreatiesWeb3 = require("debug")("loadTreatiesWeb3");

////////////////////////////////////
//Configuration
const treatyServer = "http://localhost:8081";
const PersistMode = {
  ONCHAIN: 0,
  THREEBOX: 1,
  MONGO: 2,
};
const TREATY_TEXT_PERSIST_MODE = PersistMode.THREEBOX;
const TREATY_PERSIST_MODE = PersistMode.ONCHAIN;
const TREATY_SIGNATURE_PERSIST_MODE = PersistMode.ONCHAIN;
const TREATY_STATUS_PERSIST_MODE = PersistMode.ONCHAIN;
//
///////////////////////////////////

export const loadWeb3DirectDispatch = () => async (dispatch) => {
  const web3 = await getWeb3();
  dispatch(web3Loaded(web3));
  return web3;
};

export const loadAccountDirectDispatch = (web3) => async (dispatch) => {
  console.log("web3", web3);
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
  console.log("web3", web3);
  // console.log("web3.eth.getAccounts()", web3.eth.getAccounts);
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(accountLoaded(account));
  return account;
};

export const loadContract = async (web3) => {
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

async function getUnsignedText(treatyInstance, i) {
  const lineOfUnsignedText = await treatyInstance.methods
    .unsignedTreatyText(i)
    .call();
  return lineOfUnsignedText;
}

async function getSignedText(treatyInstance, i) {
  const lineOfSignedText = await treatyInstance.methods
    .signedTreatyText(i)
    .call();
  return lineOfSignedText;
}

async function getSigner(treatyInstance, i) {
  const signer = await treatyInstance.methods.signatureList(i).call();
  return signer;
}

async function getFor(n, lookupFunction, treatyInstance) {
  var result = [];
  for (let i = 0; i < n; i++) {
    result.push(await lookupFunction(treatyInstance, i));
  }
  console.log("getFor returning: ", result);
  return result;
}

// export const get3boxSignedTreatyText = (treaty) => async (
//   dispatch,
//   getState
// ) => {
//   const threebox = getState().threebox.threebox;
//   const openSpace = getState().threebox.openSpace;
//   console.log("threebox", threebox);
//   console.log("openSpace", openSpace);
//   console.log("openSpace", openSpace);

//   //create/join an open thread
//   const signedTreatyTextThread = await openSpace.joinThread(
//     `signed-treaty-text-${treaty.id}`
//   );
//   const signedTreatyText = await signedTreatyTextThread.getPosts({ limit: 50 });
//   console.log("signedTreatyText is ", signedTreatyText);
//   if (signedTreatyText == null) {
//     return [];
//   }
//   return signedTreatyText;
// };

async function get3boxUnsignedTreatyText(threebox, openSpace, treatyId) {
  console.log("[get3boxUnsignedTreatyText]");
  // const threebox = getState().threebox.threebox;
  // const openSpace = getState().threebox.openSpace;
  console.log("threebox", threebox);
  console.log("openSpace", openSpace);

  if (openSpace == null) {
    return ["LOADING FROM 3BOX..."];
  }

  //create/join an open thread
  const unsignedTreatyTextThread = await openSpace.joinThread(
    `unsigned-treaty-text-${treatyId}`
  );
  console.log(
    "[get3boxUnsignedTreatyText] joined thread with id ",
    `unsigned-treaty-text-${treatyId}`
  );
  const unsignedTreatyText = await unsignedTreatyTextThread.getPosts({
    limit: 20,
  });
  console.log("unsignedTreatyText is ");
  console.log(unsignedTreatyText);

  return unsignedTreatyText.map((postObject) => {
    return postObject.message;
  });
}

async function get3boxSignedTreatyText(threebox, openSpace, treatyId) {
  console.log("[get3boxSignedTreatyText]");
  // const threebox = getState().threebox.threebox;
  // const openSpace = getState().threebox.openSpace;
  console.log("threebox", threebox);
  console.log("openSpace", openSpace);

  if (openSpace == null) {
    return ["LOADING FROM 3BOX..."];
  }

  //create/join an open thread
  const signedTreatyTextThread = await openSpace.joinThread(
    `signed-treaty-text-${treatyId}`
  );
  const signedTreatyText = await signedTreatyTextThread.getPosts({
    limit: 50,
  });
  console.log("signedTreatyText is ");
  console.log(signedTreatyText);

  return signedTreatyText.map((postObject) => {
    return postObject.message;
  });
}
// export const get3boxUnsignedTreatyText = (treaty) => async (
//   dispatch,
//   getState
// ) => {
//   console.log("[get3boxUnsignedTreatyText]");
//   const threebox = getState().threebox.threebox;
//   const openSpace = getState().threebox.openSpace;
//   console.log("threebox", threebox);
//   console.log("openSpace", openSpace);
//   console.log("openSpace", openSpace);

//   //create/join an open thread
//   const unsignedTreatyTextThread = await openSpace.joinThread(
//     `unsigned-treaty-text-${treaty.id}`
//   );
//   await unsignedTreatyTextThread.post("hello");
//   const unsignedTreatyText = await unsignedTreatyTextThread.getPosts({
//     limit: 50,
//   });
//   console.log("unsignedTreatyText is ");
//   console.log(unsignedTreatyText);

//   if (unsignedTreatyText == null) {
//     return [];
//   }
//   return unsignedTreatyText;
// };

async function parseTreaty(treatyInstance, threebox, openSpace) {
  console.log("called parseTreaty with ", treatyInstance, threebox, openSpace);
  debugParseTreaty("parseTreaty", treatyInstance);

  const numUnsigned = await treatyInstance.methods.getNumUnsigned().call();
  const numSigned = await treatyInstance.methods.getNumSigned().call();
  const numSigners = await treatyInstance.methods.getNumSignatures().call();
  const treatyId = await treatyInstance.methods.id().call();
  const treaty = {
    id: treatyId,
    text: await treatyInstance.methods.name().call(),
    isCompleted: (await treatyInstance.methods.treatyState().call()) == 1,
    createdAt: await treatyInstance.methods.creationTime().call(),
    signers: await getFor(numSigners, getSigner, treatyInstance),
    // signatureStatus: signers && signers.map((signer) => async ( humanReadableSignatureStatus(await treatyInstance.methods.signatureState(signer).call()) )),
    status: humanReadableTreatyStatus(
      await treatyInstance.methods.treatyState().call()
    ),
    unsignedTreatyText: await getUnsignedTreatyText(
      numUnsigned,
      getUnsignedText,
      treatyInstance,
      threebox,
      openSpace,
      treatyId
    ),
    signedTreatyText: await getSignedTreatyText(
      numUnsigned,
      getSignedText,
      treatyInstance,
      threebox,
      openSpace,
      treatyId
    ),
    // unsignedTreatyText: await getFor(
    //   numUnsigned,
    //   getUnsignedText,
    //   treatyInstance
    // ),
    // signedTreatyText: await getFor(numSigned, getSignedText, treatyInstance),
    address: await treatyInstance._address,
    contractInstance: treatyInstance,
  };
  debugParseTreaty("[parsedTreaty] treaty is ", treaty);
  console.log("[parsedTreaty] treaty is ", treaty);
  return treaty;
}

//this is stupid because half of the args are unused in each case
async function getUnsignedTreatyText(
  numUnsigned,
  getUnsignedText,
  treatyInstance,
  threebox,
  openSpace,
  treatyId
) {
  switch (TREATY_TEXT_PERSIST_MODE) {
    case PersistMode.THREEBOX:
      console.log("Case: THREEBOX. about to look up treaty text from 3box");
      return await get3boxUnsignedTreatyText(threebox, openSpace, treatyId);
      break;
    case PersistMode.ONCHAIN:
      console.log("Case: ONCHAN");
    default:
      console.log("Case: DEFAULT");
      return await getFor(numUnsigned, getUnsignedText, treatyInstance);
  }
}

//this is stupid because half of the args are unused in each case
async function getSignedTreatyText(
  numSigned,
  getSignedText,
  treatyInstance,
  threebox,
  openSpace,
  treatyId
) {
  switch (TREATY_TEXT_PERSIST_MODE) {
    case PersistMode.THREEBOX:
      console.log("Case: THREEBOX. about to look up treaty text from 3box");
      return await get3boxSignedTreatyText(threebox, openSpace, treatyId);
      break;
    case PersistMode.ONCHAIN:
      console.log("Case: ONCHAIN");
    default:
      console.log("Case: DEFAULT");
      return await getFor(numSigned, getSignedText, treatyInstance);
  }
}

export const loadOneTreatyRequest = (treatyInstance) => async (
  dispatch,
  getState
) => {
  logTimeInMs("[loadOneTreatyRequest] ", treatyInstance);
  const threebox = getState().threebox.threebox;
  const openSpace = getState().threebox.openSpace;
  const treaty = await parseTreaty(treatyInstance, threebox, openSpace);

  // if (TREATY_TEXT_PERSIST_MODE == PersistMode.THREEBOX) {
  //   console.log("about to look up treaty text from 3box");
  //   treaty.unsignedTreatyText = await get3boxUnsignedTreatyText(
  //     threebox,
  //     openSpace,
  //     treaty
  //   );
  //   treaty.signedTreatyText = await get3boxSignedTreatyText(
  //     threebox,
  //     openSpace,
  //     treaty
  //   );
  // treaty.unsignedTreatyText = dispatch(get3boxUnsignedTreatyText(treaty));
  // treaty.signedTreatyText = dispatch(get3boxSignedTreatyText(treaty));
  console.log("unsignedTreatyText", treaty.unsignedTreatyText);
  console.log("signedTreatyText", treaty.signedTreatyText);
  // }

  logTimeInMs("[about to dispatch action with treaty: ] ", treaty);
  dispatch(loadOneTreaty(treaty));
};

export const loadTreatiesWeb3 = (/*web3, treatyIndex*/) => async (
  dispatch,
  getState
) => {
  try {
    console.log("start loadTreatiesWeb3");
    const web3 = getState().web3.connection;
    const threebox = getState().threebox.threebox;
    const openSpace = getState().threebox.openSpace;
    console.log("web3", web3);

    const treatyIndex = getState().contract.treatyIndex;
    console.log("treatyIndex", treatyIndex);

    console.log("STATE");
    console.log(getState());

    dispatch(loadTreatiesInProgress());
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = TreatyContract.networks[networkId];

    const treatyInstances = treatyIndex.map((treatyAddress) => {
      return new web3.eth.Contract(TreatyContract.abi, treatyAddress);
    });

    const treaties = await Promise.all(
      treatyInstances.map(async (treatyInstance) => {
        console.log("treatyInstance");
        console.log(treatyInstance);
        const numUnsigned = await treatyInstance.methods
          .getNumUnsigned()
          .call();
        const numSigned = await treatyInstance.methods.getNumSigned().call();
        const numSigners = await treatyInstance.methods
          .getNumSignatures()
          .call();
        console.log(
          `there are ${numSigned} signed, and ${numUnsigned} unsigned`
        );
        console.log("state", getState(), threebox, openSpace);

        const treaty = await parseTreaty(treatyInstance, threebox, openSpace);

        // console.log("after parsetreaty: ", treaty);
        // if (TREATY_TEXT_PERSIST_MODE == PersistMode.THREEBOX) {
        //   console.log(
        //     "[loadTreatiesWeb3] about to look up treaty text from 3box"
        //   );
        //   treaty.unsignedTreatyText = await get3boxUnsignedTreatyText(
        //     threebox,
        //     openSpace,
        //     treaty.id
        //   );
        //   treaty.signedTreatyText = await get3boxSignedTreatyText(
        //     threebox,
        //     openSpace,
        //     treaty.id
        //   );
        //   console.log("treaty after inline mutation", treaty);
        // } else {
        //   console.log("threebox mode not enabled");
        // }
        console.log("treaty returned by inner map", treaty);
        return treaty;
      })
    );
    console.log("treaties returned by loadTreatiesWeb3", treaties);
    dispatch(loadTreatiesSuccess(treaties));
  } catch (e) {
    console.log("Exception in loadTreatiesWeb3");
    console.log(e);
    dispatch(loadTreatiesFailure());
    dispatch(displayAlert(e));
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
  const web3 = getState().web3.connection;
  const currentAccount = getState().web3.account;
  try {
    const tx = await contractInstance.methods
      .makeActive()
      .send({ from: currentAccount });
    console.log("tx");
    console.log(tx);
    await dispatch(markActive(treaty));
    dispatch(loadOneTreatyRequest(contractInstance));
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
  console.log("joinRequest for: ", treaty);
  const { id, address, contractInstance } = treaty;
  const currentAccount = getState().web3.account;
  const web3 = getState().web3.connection;
  console.log("contractInstance", contractInstance);
  console.log("currentAccount", currentAccount);
  console.log("web3", web3);
  try {
    const tx = await contractInstance.methods
      .registerAsSigner()
      .send({ from: currentAccount });

    dispatch(joinTreaty(treaty));
    dispatch(loadOneTreatyRequest(web3, contractInstance));
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
    var freshWeb3 = new Web3(Web3.givenProvider);

    const treatyContract1 = web3.eth.contract(TreatyContract.abi);
    console.log(treatyContract1);

    const currentAccount = getState("web3").web3.account;
    const contractCode = "0x" + TreatyBin.bin;
    const id = Math.floor(Math.random() * 10 ** 6);
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
          dispatch(loadOneTreatyRequest(contract));
          dispatch(createTreaty(contract));
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

    // const addedTreaty = await response.json();
    // console.log("response.json");
    // console.log(addedTreaty);
    // dispatch(loadTreatiesWeb3());
    // dispatch(createTreaty(treaty));
  } catch (e) {
    console.log("[addTreatyRequest] ERROR", e);
    dispatch(displayAlert(e));
  } finally {
  }
};

export const addToTreatyIndexRequest = (treatyInstance, address) => async (
  dispatch,
  getState
) => {
  try {
    console.log("called addToTreatyIndexRequest for address ", address);
    console.log(getState());
    const currentAccount = getState().web3.account;
    const web3 = getState().web3;
    const treatyIndexInstance = getState().contract.treatyIndexContract;
    console.log("treatyIndexInstance", treatyIndexInstance);
    console.log("currentAccount", currentAccount);

    const tx = await treatyIndexInstance.methods.addTreaty(address).send({
      from: currentAccount,
    });
    console.log("tx", tx);
    dispatch(loadOneTreaty(web3, treatyInstance));
    dispatch(addToTreatyIndex(treatyInstance));
  } catch (e) {
    console.log("[addToTreatyIndexRequest] ERROR");
    console.log(e);
    dispatch(displayAlert(e));
  }
};

function timeInMs() {
  return new Date().getTime();
}

function logTimeInMs(text, ...args) {
  console.log(`[TIME:${timeInMs()}] ${text}`, args);
}

export const addTreatyTextRequest = (treaty, text) => async (
  dispatch,
  getState
) => {
  console.log(`add treaty text with id ${treaty.id}, text ${text}`);
  try {
    console.log("treaty", treaty);
    const { contractInstance } = treaty;
    const currentAccount = getState().web3.account;

    switch (TREATY_TEXT_PERSIST_MODE) {
      case PersistMode.ONCHAIN:
        logTimeInMs("write to chain");
        const tx = await contractInstance.methods
          .writeToTreaty(text)
          .send({ from: currentAccount });
        logTimeInMs("done tx", tx);
        break;

      case PersistMode.THREEBOX:
        logTimeInMs("write to threebox");
        console.log("state when persisting to threebox is ", getState());
        const threebox = getState().threebox.threebox;
        const openSpace = getState().threebox.openSpace;
        console.log("threebox", threebox);
        console.log("openSpace", openSpace);
        console.log("openSpace", openSpace);

        //create an open thread
        const unsignedTreatyTextThread = await openSpace.joinThread(
          `unsigned-treaty-text-${treaty.id}`
        );
        console.log(
          "joined thread with id ",
          `unsigned-treaty-text-${treaty.id}`
        );
        // //later: create a closed thread
        // const treatyTextThread = await openSpace.joinThread(
        //   treaty.id + "treaty-text", {
        //     firstModerator: <ethereum address or 3id>,
        //     members: true
        //   }
        // );

        //add members with
        // await treatyTextThread.addMember(<eth address or 3id>)

        // confidential thread with createConfidentialThread

        //join a thread either by using the same parameters used when created, or
        // better still,
        // const thread = await space.joinThreadByAddress('/orbitdb/zdpuAp5QpBKR4BBVTvqe3KXVcNgo4z8Rkp9C5eK38iuEZj3jq/3box.thread.testSpace.testThread')

        //get address with
        //const threadAddress = thread.address

        //get posts with:
        const unsignedTreatyText = await unsignedTreatyTextThread.getPosts({
          limit: 20,
        });
        console.log("thread says: ", unsignedTreatyText);

        //add a post
        await unsignedTreatyTextThread.post(text);
        console.log("posted: ", text);

        //then subscribe with
        // thread.onUpdate(myCallbackFunction);

        //setting. these values are private to each user so not appropriate for this case
        // const previousValue = await openSpace.public.get(
        //   treaty.id + "treaty-text"
        // );
        // const treatyTextList = await previousValue.concat(text);
        // const after = await openSpace.public.set(
        //   treaty.id + "treaty-text",
        //   treatyTextList
        // );

        // await openSpace.public.set(treaty.id + "treaty-text", text);
        // console.log(
        //   "value is now ",
        //   await openSpace.public.get(treaty.id + "treaty-text")
        // );
        break;

      case PersistMode.MONGO:
        const response = await fetch(`${treatyServer}/treaties/${id}/text`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
          method: "post",
        });
        const updatedTreaty = await response.json();
        console.log(updatedTreaty);
        break;

      default:
        alert("No match for persist mode");
    }

    dispatch(addTextToTreaty(treaty, text));

    dispatch(loadOneTreatyRequest(contractInstance));

    // todo: consider using finer granlarity on the reducer
    // dispatch(addTextToTreaty(updatedTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  }
};

export const removeTreatyRequest = (id) => async (dispatch) => {
  try {
    alert(`Not implemented: Remove treaty with id ${id}`);
    // console.log("remove treaty request");
    // console.log(id);
    // const response = await fetch(`http://localhost:8081/treaties/${id}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: "",
    //   method: "delete",
    // });
    // const removedTreaty = await response.json();
    // console.log(removedTreaty);
    // dispatch(removeTreaty(removedTreaty));
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

    dispatch(signTreaty(treaty));
    dispatch(loadOneTreatyRequest(contractInstance));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};

// 3box
export const load3boxRequest = (address, provider) => async (
  dispatch,
  getState
) => {
  address = "0x01d0ef4E369bAc36EE55f75d3273745F21D6B239";
  console.log("load 3box for address ", address);
  console.log("load 3box for provider ", provider);
  if (address == null) address = getState.web3.account;
  if (provider == null) provider = getState.web3.connection;
  console.log("load 3box for address ", address);
  console.log("load 3box for provider ", provider);
  if (typeof address != "string") {
    address = valueOf(address);
  }
  try {
    const box = await Box.openBox(address, provider, {});
    console.log("successful load of 3box", box);
    await box.syncDone;
    console.log("syncdone", box.syncDone);
    dispatch(load3box(box));
    const treatifySpace = await box.openSpace("treatify");
    console.log("opened space ", treatifySpace);
    dispatch(openSpace(treatifySpace));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};
