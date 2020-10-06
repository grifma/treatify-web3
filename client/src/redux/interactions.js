import getWeb3 from "../getWeb3";
import {
  accountLoaded,
  web3Loaded,
  treatyIndexLoaded,
  treatyContractLoaded,
  treatyIndexContractLoaded,
  loadTreatiesInProgress,
  loadTreatiesFailure,
  loadTreatiesSuccess,
  loadOneTreatySuccess,
  loadOneTreatyFailure,
  loadOneTreatyInProgress,
  load3boxInProgress,
  load3boxSuccess,
  load3boxFailure,
  removeTreaty,
  createTreaty,
  markActive,
  addTextToTreaty,
  signTreaty,
  joinTreaty,
  addToTreatyIndex,
  openSpace,
  ethersProviderLoaded,
  ethersSignerLoaded,
} from "../redux/actions";
import {
  humanReadableTreatyStatus,
  humanReadableSignatureStatus,
  humanReadableTreatyType,
} from "../utility/enumMappings";
import TreatyIndexContract from "../contracts/TreatyIndex.json";
import TreatyContract from "../contracts/Treaty.json";
import TreatyBin from "../contracts/TreatyBin.json";
import Web3 from "web3";
import { batch } from "react-redux";
import Box from "3box";
import { AssertionError } from "assert";
import ethers from "ethers";
import { PersistMode } from "./constants";
require("events").EventEmitter.defaultMaxListeners = 50;

////////////////////////////////////
//NOTE
//
//This code base is very much in progress.
//It serves as a first exploration of 3box and first major project in React and Redux.
//Working, but in need of enhancements and much polish.
//
////////////////////////////////////

////////////////////
//General helper functions
////////////////////

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

export const displayAlert = (text) => () => {
  alert(text);
};

////////////////////
//Treaty specific helper functions
////////////////////

async function pullTreaty(
  treatyInstance,
  threebox,
  openSpace,
  address
  // daiInstance
) {
  // console.info("[pullTreaty]", treatyInstance, threebox, openSpace);
  const numUnsigned = await treatyInstance.methods.getNumUnsigned().call();
  const numSigned = await treatyInstance.methods.getNumSigned().call();
  const numSigners = await treatyInstance.methods.getNumSignatures().call();
  const treatyId = Number(await treatyInstance.methods.id().call());

  // console.log(
  //   `[pullTreaty] there are ${numSigners} signers. This is treaty #${treatyId}`
  // );

  const signers = [];
  var i;
  for (i = 0; i < numSigners; i++) {
    signers.push(await treatyInstance.methods.signatureList(i).call());
    // console.log("[pullTreaty] signer pushed");
  }

  // console.log("pullTreaty] signers: :>> ", signers);
  const treaty = {
    id: treatyId,
    text: await treatyInstance.methods.name().call(),
    isCompleted: (await treatyInstance.methods.treatyState().call()) == 1,
    createdAt: await treatyInstance.methods.creationTime().call(),
    signers: await getFor(numSigners, getSigner, treatyInstance),
    signatureState:
      signers &&
      (await Promise.all(
        signers.map(async (signer) => {
          console.log("signatureStatus called for signer: ", signer);
          const result = humanReadableSignatureStatus(
            await treatyInstance.methods.signatureState(signer).call()
          );
          return result;
        })
      )),
    status: humanReadableTreatyStatus(
      await treatyInstance.methods.treatyState().call()
    ),
    unsignedTreatyText: await getUnsignedTreatyText(
      numUnsigned,
      getUnsignedText,
      treatyInstance,
      threebox,
      openSpace,
      treatyId,
      signers
    ),
    signedTreatyText: await getSignedTreatyText(
      numUnsigned,
      getSignedText,
      treatyInstance,
      threebox,
      openSpace,
      treatyId,
      signers,
      address
    ),
    address: await treatyInstance._address,
    contractInstance: treatyInstance,
    developerInfo: await get3boxDeveloperInfo(treatyId, openSpace),
    // balance: await daiInstance.balanceOf(address),
    balance: 0,
  };
  console.log("treaty.signatureStatus :>> ", treaty.signatureStatus);
  return treaty;
}

async function getUnsignedText(treatyInstance, i) {
  if (treatyInstance.unsignedTreatyText == undefined) return "";
  const lineOfUnsignedText = await treatyInstance.unsignedTreatyText(i);
  return lineOfUnsignedText;
}

async function getSignedText(treatyInstance, i) {
  if (treatyInstance.signedTreatyText == undefined) return "";
  const lineOfSignedText = await treatyInstance.signedTreatyText(i);
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
  return result;
}

async function getUnsignedTreatyText(
  numUnsigned,
  getUnsignedText,
  treatyInstance,
  threebox,
  openSpace,
  treatyId,
  signers
) {
  switch (parseInt(process.env.TREATY_TEXT_PERSIST_MODE)) {
    case PersistMode.THREEBOX:
      console.log("Case: THREEBOX");
      return await get3boxUnsignedTreatyText(
        threebox,
        openSpace,
        treatyId,
        signers
      );
      break;
    case PersistMode.ONCHAIN:
      console.log("Case: ONCHAIN");
    default:
      console.log("Case: DEFAULT");
      return await getFor(numUnsigned, getUnsignedText, treatyInstance);
  }
}

async function getSignedTreatyText(
  numSigned,
  getSignedText,
  treatyInstance,
  threebox,
  openSpace,
  treatyId,
  signers,
  address
) {
  switch (parseInt(process.env.TREATY_TEXT_PERSIST_MODE)) {
    case PersistMode.THREEBOX:
      // console.log("Case: THREEBOX");
      return await get3boxSignedTreatyText(
        threebox,
        openSpace,
        treatyId,
        signers,
        address
      );
      break;
    case PersistMode.ONCHAIN:
    // console.log("Case: ONCHAIN");
    default:
      // console.log("Case: DEFAULT");
      return await getFor(numSigned, getSignedText, treatyInstance);
  }
}

async function get3boxUnsignedTreatyText(
  threebox,
  openSpace,
  treatyId,
  signers
) {
  // console.log(`Treaty id is ${treatyId}`);
  // console.log("threadName: ", `unsigned-treaty-text-${treatyId}`);
  // console.log("signers :>> ", signers);
  try {
    if (openSpace != undefined) {
      // console.info(`#${treatyId}Logged in, using joinThread()`);
      const thread = await openSpace.joinThread(
        `unsigned-treaty-text-${treatyId}`
      );

      const posts = await thread.getPosts({
        limit: process.env.THREEBOX_POST_LIMIT,
      });
      return posts.map((x) => x.message);
    } else {
      console.log(
        "process.env.PRELOAD_BEFORE_LOGIN == false :>> ",
        process.env.PRELOAD_BEFORE_LOGIN == false
      );
      console.log(
        "process.env.PRELOAD_BEFORE_LOGIN == 0 :>> ",
        process.env.PRELOAD_BEFORE_LOGIN == 0
      );
      if (process.env.PRELOAD_BEFORE_LOGIN == false) return ["Loading..."];

      const postsBySigner = await Promise.all(
        signers.map(async (signer) => {
          return await Box.getThread(
            "treatify",
            `unsigned-treaty-text-${treatyId}`,
            signer,
            false
          );
        })
      );
      const postsUndefined = postsBySigner.filter((x) => x.length == 0);
      var posts;

      if (postsUndefined.length == postsBySigner.length) {
        return [];
      } else {
        const postsBySignerEmptyFiltered = postsBySigner.filter(
          (x) => x.length > 0
        );
        posts = postsBySignerEmptyFiltered[0];
        // const posts = postsBySigner.filter((x) => x.length > 0)[0];
        if (postsBySignerEmptyFiltered > 0) {
          console.error(
            "There should only be one filter match. Only one signer is the first moderator.",
            posts
          );
        }
      }

      if (posts == postsUndefined) {
        return [];
      }
      return posts.map((post) => {
        return post.message;
      });
    }
  } catch (e) {
    console.error("Error loading from 3box");
    console.error(e);
    return ["Error loading from 3box, see console.log"];
  } finally {
  }
}

async function profileInfo(treatyId, address, thread) {
  const profile = await Box.getProfile(address);
  try {
    const moderators = await thread.listModerators();
    if (moderators.length == 1 && moderators[0] == profile.address) {
      // console.log("This user is the moderator");
    }
  } catch (e) {
    console.error("Failed to list moderators ", e);
  }
}

async function get3boxSignedTreatyText(
  threebox,
  openSpace,
  treatyId,
  signers,
  address
) {
  try {
    if (openSpace != undefined) {
      console.info(`#${treatyId}Logged in, using joinThread()`);
      const thread = await openSpace.joinThread(
        `signed-treaty-text-${treatyId}`
      );
      profileInfo(treatyId, address, thread);

      const posts = await thread.getPosts({
        limit: process.env.THREEBOX_POST_LIMIT,
      });
      return posts.map((x) => x.message);
    } else {
      if (process.env.PRELOAD_BEFORE_LOGIN == false) return ["Loading..."];
      console.info(`#${treatyId} Not logged in, using getThread()`);
      const postsBySigner = await Promise.all(
        signers.map(async (signer) => {
          return await Box.getThread(
            "treatify",
            `unsigned-treaty-text-${treatyId}`,
            signer,
            false
          );
        })
      );
      const undefined = postsBySigner.filter((x) => x == undefined);

      const allUndefined = undefined.length == postsBySigner.length;

      var posts;

      if (allUndefined) {
        return [];
      } else {
        const postsBySignerEmptyFiltered = postsBySigner.filter(
          (x) => x.length > 0
        );
        posts = postsBySignerEmptyFiltered[0];

        if (postsBySignerEmptyFiltered > 0) {
          console.error(
            "There should only be one filter match. Only one signer is the first moderator.",
            posts
          );
        }
      }
      if (posts == undefined) {
        // console.log(
        //   `treaty #${treatyId}, posts are undefined. Returning empty list.`
        // );
        return [];
      }
      // console.log(`Treaty id  ${treatyId} has ${posts.length} posts`);

      return posts.map((post) => {
        return post.message;
      });
    }
  } catch (e) {
    console.error("Error loading from 3box");
    console.error(e);
    return ["Error loading from 3box, see console.log"];
  } finally {
  }

  // //create/join an open thread
  // const signedTreatyTextThread = await openSpace.joinThread(
  //   `signed-treaty-text-${treatyId}`
  // );
  // const signedTreatyText = await signedTreatyTextThread.getPosts({
  //   limit: process.env.THREEBOX_POST_LIMIT,
  // });
}

async function get3boxDeveloperInfo(treatyId, openSpace) {
  var returnValue = {
    "Without auth": {
      // "UnsignedText Moderators": await openSpace
      //   .joinThread(`unsigned-treaty-text-${treatyId}`)
      //   .listModerators(),
      // "SignedText Moderators": await openSpace
      //   .joinThread(`signed-treaty-text-${treatyId}`)
      //   .listModerators(),
    },
  };

  if (openSpace != undefined) {
    const unsignedThread = await openSpace.joinThread(
      `unsigned-treaty-text-${treatyId}`
    );
    const signedThread = await openSpace.joinThread(
      `signed-treaty-text-${treatyId}`
    );
    returnValue["With auth"] = {
      "UnsignedText Moderators": await unsignedThread.listModerators(),
      "SignedText Moderators": await signedThread.listModerators(),
    };
  }
  return [JSON.stringify(returnValue)];
}

////////////////////
// Load functions
////////////////////

export const loadEthersProvider = (ethereumProvider) => async (dispatch) => {
  const provider = new ethers.providers.Web3Provider(ethereumProvider);
  dispatch(ethersProviderLoaded(provider));
  return provider;
};

export const loadEthersSigner = (provider) => async (dispatch) => {
  const signer = provider.getSigner(0);
  console.info("signer", signer);
  dispatch(ethersSignerLoaded(signer));
  return signer;
};

export const loadWeb3 = () => async (dispatch) => {
  const web3 = await getWeb3();
  dispatch(web3Loaded(web3));
  return web3;
};

export const loadAccount = (web3) => async (dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(accountLoaded(account));
  return account;
};

export const loadTreatyIndexContractWeb3 = (web3) => async (dispatch) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = TreatyIndexContract.networks[networkId];
  const instance = new web3.eth.Contract(
    TreatyIndexContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  console.log("LOAD TREATY INDEX");
  console.log("instance :>> ", instance);
  console.log("networkId :>> ", networkId);
  console.log("web3 :>> ", web3);
  dispatch(treatyIndexContractLoaded(instance));
  return instance;
};

// export const loadTreatyIndexContract = (web3 /* Delete me */) => async (
//   dispatch,
//   getState
// ) => {
//   console.log("loadTreatyIndexContract ETHERS :>> ");
//   const provider = await getState().ethers.provider;
//   console.log("provider :>> ", provider);
//   console.log("provider.getNetwork() :>> ", provider.getNetwork());
//   const network = await provider.getNetwork();
//   const networkId = network.chainId;
//   console.log("networkId :>> ", networkId);
//   const deployedNetwork = TreatyIndexContract.networks[networkId];
//   console.log("deployedNetwork :>> ", deployedNetwork);
//   console.log("TreatyIndexContract :>> ", TreatyIndexContract);
//   console.log("TreatyIndexContract.address :>> ", TreatyIndexContract.address);
//   console.log("TreatyIndexContract.address :>> ", TreatyIndexContract._address);
//   console.log(
//     "TreatyIndexContract deployedNetwork.address :>> ",
//     deployedNetwork.address
//   );
//   const ethersInstance = new ethers.Contract(
//     // TreatyIndexContract.address,
//     "0x56a342C8b0BA5F1f408E811475d6AF1F8E05f900", //TODO Load this from json
//     TreatyIndexContract.abi,
//     provider
//   );
//   console.log("LOAD TREATY INDEX");
//   console.log("ethersInstance :>> ", ethersInstance);
//   console.log("provider :>> ", provider);
//   dispatch(treatyIndexContractLoaded(ethersInstance));
//   return ethersInstance;
// };

export const loadTreatyContractWeb3 = (web3) => async (dispatch) => {
  console.log("[loadTreatyContractWeb3]");
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = TreatyContract.networks[networkId];
  const provider = getState().ethers.provider;
  const instance = new web3.eth.Contract(
    TreatyContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  dispatch(treatyContractLoaded(instance));
  return instance;
};

export const loadTreatyContract = (web3) => async (dispatch) => {
  console.log("[loadTreatyContract]");
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = TreatyContract.networks[networkId];
  const provider = getState().ethers.provider;
  const ethersInstance = new ethers.Contract(
    deployedNetwork.address,
    TreatyContract.abi,
    provider.getSigner(0)
  );

  // const instance = new web3.eth.Contract(
  //   TreatyContract.abi,
  //   deployedNetwork && deployedNetwork.address
  // );
  dispatch(treatyContractLoaded(ethersInstance));
  // return instance;
  return ethersInstance;
};

export const loadTreatyIndex = (contract) => async (dispatch, getState) => {
  console.log("etherscontract", contract);
  const treatyIndex = await contract.getTreatyIndex();
  console.log(`there are ${await contract.getNumTreaties()} treaties`);
  console.log("treatyIndex :>> ", treatyIndex);
  dispatch(treatyIndexLoaded(treatyIndex));
  return treatyIndex;
};

export const loadTreatyIndexWeb3 = (contract) => async (dispatch) => {
  console.log("etherscontract", contract);
  const treatyIndex = await contract.methods.getTreatyIndex().call();
  console.log(
    `there are ${await contract.methods.getNumTreaties().call()} treaties`
  );
  console.log("treatyIndex :>> ", treatyIndex);
  dispatch(treatyIndexLoaded(treatyIndex));
  return treatyIndex;
};

export const loadStoredData = (contract) => async (dispatch) => {
  const value = await contract.methods.get().call();
  dispatch(valueLoaded(value));
  return value;
};

export const loadTreatiesWeb3 = () => async (dispatch, getState) => {
  try {
    const web3 = getState().web3.connection;
    const threebox = getState().threebox.threebox;
    const openSpace = getState().threebox.openSpace;
    const address = getState().web3.account;

    const treatyIndex = getState().contract.treatyIndex;

    dispatch(loadTreatiesInProgress());
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = TreatyContract.networks[networkId];
    const provider = getState().ethers.provider;
    const signer = getState().ethers.signer;
    console.log("treatyIndex :>> ", treatyIndex);
    const treatyInstances = treatyIndex.map((treatyAddress) => {
      return new web3.eth.Contract(TreatyContract.abi, treatyAddress);
    });
    console.log("treatyInstances :>> ", treatyInstances);
    const treaties = await Promise.all(
      treatyInstances.map(async (treatyInstance) => {
        const numUnsigned = await treatyInstance.methods.getNumUnsigned();
        const numSigned = await treatyInstance.methods.getNumSigned();
        const numSigners = await treatyInstance.methods.getNumSignatures();
        const treaty = await pullTreaty(
          treatyInstance,
          threebox,
          openSpace,
          address
        );
        return treaty;
      })
    );
    console.log("treaties :>> ", treaties);

    dispatch(loadTreatiesSuccess(treaties));
    console.log("about to enrich from loadTreatiesWeb3");
    dispatch(enrichTreatyWith3boxData(threebox, openSpace, treaties));
  } catch (e) {
    console.error("Failure during loadTreatiesWeb3");
    dispatch(loadTreatiesFailure());
    dispatch(displayAlert(e));
  }
};

export const loadTreaties = () => async (getState) => {
  try {
    dispatch(loadTreatiesInProgress());
    const response = await fetch(`${process.env.TREATY_SERVER}/treaties`);
    const treaties = await response.json();
    dispatch(loadTreatiesSuccess(treaties));
  } catch (e) {
    dispatch(loadTreatiesFailure());
    dispatch(displayAlert(e));
  }
};

export const loadOneTreatyByAddress = (address) => async (
  dispatch,
  getState
) => {
  const web3 = getState().web3.connection;
  console.log("Load treaty for address", address);
  const instance = await new web3.eth.Contract(TreatyContract.abi, address);
  console.log("LoadOneTreaty for instance", instance);
  dispatch(loadOneTreaty(instance));
};

export const loadOneTreaty = (treatyInstance) => async (dispatch, getState) => {
  console.log("[loadOneTreaty] ", treatyInstance);
  try {
    dispatch(loadOneTreatyInProgress());
    const threebox = getState().threebox.threebox;
    const openSpace = getState().threebox.openSpace;
    const address = getState().threebox.account;
    // const daiInstance = getState().currencies.daiInstance;
    console.log(
      "[loadOneTreaty] Parse treaty with ",
      treatyInstance,
      threebox,
      openSpace
    );
    const treaty = await pullTreaty(
      treatyInstance,
      threebox,
      openSpace,
      address
    );
    console.log(
      "[loadOneTreaty] about to dispatch success action with parsed treaty: ",
      treaty
    );
    dispatch(loadOneTreatySuccess(treaty));
  } catch (e) {
    console.error("[loadOneTreaty] Exception: ", e);
    dispatch(loadOneTreatyFailure());
  }
};

export const load3box = (address, provider) => async (dispatch, getState) => {
  if (typeof address != "string") {
    address = valueOf(address);
  }
  try {
    dispatch(load3boxInProgress());
    const box = await Box.openBox(address, provider, {});
    console.info("successful load of 3box", box);
    await box.syncDone;
    console.log("syncdone", box.syncDone);
    const treatifySpace = await box.openSpace("treatify");
    console.info("opened space ", treatifySpace);
    await dispatch(openSpace(treatifySpace));
    await dispatch(load3boxSuccess(box));
    console.log("about to enrich from load3box");
    if ((await getState().treaties.data) != undefined) {
      dispatch(
        enrichTreatyWith3boxData(
          box,
          treatifySpace,
          await getState().treaties.data
        )
      );
    }
  } catch (e) {
    console.error("Exception in load3box ", e);
    dispatch(displayAlert(e));
  } finally {
  }
};

////////////////////
//Request functions
////////////////////

export const markActiveRequest = (treaty) => async (dispatch, getState) => {
  const { id, address, contractInstance } = treaty;
  const web3 = getState().web3.connection;
  const currentAccount = getState().web3.account;
  try {
    const tx = await contractInstance.methods
      .makeActive()
      .send({ from: currentAccount });
    await dispatch(markActive(treaty));

    //If using 3box, make all registered signers moderators of the 3box thread
    if (process.env.TREATY_TEXT_PERSIST_MODE == PersistMode.THREEBOX) {
      console.log("3box mode enabled");
      // const threebox = getState().threebox.threebox;
      const openSpace = getState().threebox.openSpace;
      const thread = await openSpace.joinThread(
        `unsigned-treaty-text-${treaty.id}`
      );
      console.log(
        "created thread with id ",
        `unsigned-treaty-text-${treaty.id}`
      );

      treaty.signers.map(async (x) => {
        await thread.addModerator(x);
        console.log(`added ${x} as thread moderator`);
      });
    }

    dispatch(loadOneTreaty(contractInstance));
    // dispatch(markActive(activeTreaty));

    // const response = await fetch(`${process.env.TREATY_SERVER}/treaties/${id}/active`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "post",
    //   body: "",
    // });
    // const activeTreaty = await response.json();
    // //console.log("active treaty is " + activeTreaty);
    // dispatch(markActive(activeTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};

export const joinTreatyRequest = (treaty) => async (dispatch, getState) => {
  console.info("[joinTreatyRequest] for: ", treaty);
  const { id, address, contractInstance } = treaty;
  console.info("contractInstance", contractInstance);
  const currentAccount = getState().web3.account;
  const web3 = getState().web3.connection;
  //console.log("contractInstance", contractInstance);
  //console.log("currentAccount", currentAccount);
  //console.log("web3", web3);
  try {
    const tx = await contractInstance.methods
      .registerAsSigner()
      .send({ from: currentAccount });
    // const tx = await contractInstance.registerAsSigner();
    console.log("tx", tx);
    dispatch(joinTreaty(treaty));
    dispatch(loadOneTreaty(contractInstance));
    // const response = await fetch(`${process.env.TREATY_SERVER}/treaties/${id}/active`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "post",
    //   body: "",
    // });
    // const activeTreaty = await response.json();
    // //console.log("active treaty is " + activeTreaty);
    // dispatch(markActive(activeTreaty));
  } catch (e) {
    console.error(e);
    dispatch(displayAlert(e));
  } finally {
  }
};

export const addTreatyRequest = (text) => async (dispatch, getState) => {
  try {
    console.info("[addTreatyRequest]");
    const currentAccount = getState("web3").web3.account;
    const contractCode = "0x" + TreatyBin.bin;
    const parameters = TreatyContract.abi;
    var _id = Math.floor(Math.random() * 10 ** process.env.ID_SIZE);
    var _name = text;
    var _initialText = "Initial text for " + text;
    console.log(
      `[addTreatyRequest] About to deploy with ethers.js  ${text} . . .`
    );
    console.log("getState() :>> ", getState());
    const provider = getState().ethers.provider;
    console.log("provider :>> ", provider);
    const signer = getState().ethers.signer;
    console.log("signer :>> ", signer);

    const ContractFactory = ethers.ContractFactory;
    const factory = new ContractFactory(
      TreatyContract.abi,
      TreatyBin.bin,
      signer
    );
    console.log("factory :>> ", factory);

    const contract = await factory.deploy(_id, _name, _initialText);
    console.log("Contract waiting to deploy at :>> ", contract.address);

    console.log("Deploy transaction: " + contract.deployTransaction);

    await contract.deployTransaction.wait();
    console.log("Contract is now ready");

    console.log("contract :>> ", contract);

    // console.log(`[addTreatyRequest] About to deploy  ${text} . . .`);
    // const deployedTreaty = await treatyContract
    //   .deploy(
    //     // _id,
    //     // _name,
    //     // _initialText,
    //     {
    //       data: "0x" + TreatyBin.bin,
    //       arguments: [_id, _name, _initialText],
    //     }
    //   )
    //   .send({
    //     from: currentAccount,
    //     gas: "4700000",
    //   });

    // console.log("deployedTreaty :>> ", deployedTreaty);

    // console.log(
    //   "Contract mined! address: " +
    //     deployedTreaty.address +
    //     " transactionHash: " +
    //     deployedTreaty.transactionHash
    // );

    dispatch(addToTreatyIndexRequest(contract));
    // const web3 = getState().web3.connection;
    // const web3TreatyInstance = await new web3.eth.Contract(
    //   TreatyContract.abi,
    //   contract.address
    // );
    // dispatch(loadOneTreaty(web3TreatyInstance));

    dispatch(loadOneTreatyByAddress(contract.address));
    // dispatch(loadOneTreatyByAddress(contract.address));
    // function (e, contract) {
    //   console.info(e, contract);
    //   if (typeof contract !== "undefined") {
    //     console.log(
    //       "Contract mined! address: " +
    //         contract.address +
    //         " transactionHash: " +
    //         contract.transactionHash
    //     );
    //     dispatch(addToTreatyIndexRequest(contract));
    //     dispatch(loadOneTreaty(contract));
    //     // dispatch(createTreaty(contract)); //no longer needed as added inside loadOneTreaty
    //   } else {
    //     console.error("Contract is undefined");
    //   }
    // }
    // );
  } catch (e) {
    console.log("[addTreatyRequest] ERROR", e);
    dispatch(displayAlert(e));
  } finally {
  }
};

export const addToTreatyIndexRequest = (treatyInstance) => async (
  dispatch,
  getState
) => {
  try {
    console.log("[addToTreatyIndexRequest] ", treatyInstance);
    console.log(getState());
    const currentAccount = getState().web3.account;
    const web3 = getState().web3;
    const treatyIndexInstance = getState().contract.treatyIndexContract;
    //console.log("treatyIndexInstance", treatyIndexInstance);
    //console.log("currentAccount", currentAccount);

    const tx = await treatyIndexInstance.methods
      .addTreaty(treatyInstance.address)
      .send({
        from: currentAccount,
      });
    console.log(
      "[addToTreatyIndexRequest] Treaty added to treaty index in tx: ",
      tx
    );
    dispatch(addToTreatyIndex(treatyInstance));
  } catch (e) {
    console.error("[addToTreatyIndexRequest] Exception ", e);
    //console.log(e);
    dispatch(displayAlert(e));
  }
};

export const addTreatyTextRequest = (treaty, text) => async (
  dispatch,
  getState
) => {
  console.log(`add treaty text with id ${treaty.id}, text ${text}`);
  try {
    console.log("treaty", treaty);
    const { contractInstance } = treaty;
    const currentAccount = getState().web3.account;

    console.log("mode", process.env.TREATY_TEXT_PERSIST_MODE);
    switch (parseInt(process.env.TREATY_TEXT_PERSIST_MODE)) {
      case PersistMode.ONCHAIN:
        console.log("write to chain");
        const tx = await contractInstance.methods
          .writeToTreaty(text)
          .send({ from: currentAccount });
        console.log("done tx", tx);
        break;

      case PersistMode.THREEBOX:
        console.log("write to threebox");
        //console.log("state when persisting to threebox is ", getState());
        const threebox = getState().threebox.threebox;
        const openSpace = getState().threebox.openSpace;
        //console.log("threebox", threebox);
        //console.log("openSpace", openSpace);
        //console.log("openSpace", openSpace);

        if (openSpace == null) throw "Space is not open";

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
          limit: process.env.THREEBOX_POST_LIMIT,
        });
        //console.log("thread says: ", unsignedTreatyText);

        //add a post
        const postResult = await unsignedTreatyTextThread.post(text);
        console.log("posted: ", text);
        console.log(`postResult: ${postResult}`);

        //todo: Reset onchain signatures. OR, when we next sign something, check if the hash is the same.

        try {
          console.log(
            `moderators: ${unsignedTreatyTextThread.listModerators()}`
          );
        } catch (e) {
          console.error("Error listing modertors ", e);
        }
        console.log(`posts: `);
        console.log(unsignedTreatyTextThread.getPosts());
        break;

      case PersistMode.MONGO:
        const response = await fetch(
          `${process.env.TREATY_SERVER}/treaties/${id}/text`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
            method: "post",
          }
        );
        const updatedTreaty = await response.json();
        //console.log(updatedTreaty);
        break;

      default:
        alert("No match for persist mode");
    }

    dispatch(addTextToTreaty(treaty, text));

    dispatch(loadOneTreaty(contractInstance));

    // todo: consider using finer granlarity on the reducer
    // dispatch(addTextToTreaty(updatedTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  }
};

export const removeTreatyRequest = (treaty) => async (dispatch, getState) => {
  try {
    alert("Not implemented. Check unused folder for previous function.");
    // dispatch(loadOneTreaty(treaty.contractInstance));

    // //console.log("remove treaty request");
    // //console.log(id);
    // const response = await fetch(`http://localhost:8081/treaties/${id}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: "",
    //   method: "delete",
    // });
    // const removedTreaty = await response.json();
    // //console.log(removedTreaty);
    // dispatch(removeTreaty(removedTreaty));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};

export const signTreatyRequest = (treaty) => async (dispatch, getState) => {
  //console.log("signRequest for");
  //console.log(treaty);
  const { id, address, contractInstance } = treaty;
  const currentAccount = getState().web3.account;
  try {
    let tx;
    if (process.env.TREATY_TEXT_PERSIST_MODE == PersistMode.THREEBOX) {
      const threebox = getState().threebox.threebox;
      const openSpace = getState().threebox.openSpace;
      console.log("threebox :>> ", threebox);
      console.log("openSpace :>> ", openSpace);
      console.log("id :>> ", id);
      const contentBeingSigned = await get3boxUnsignedTreatyText(
        threebox,
        openSpace,
        id
      );
      console.log("contentBeingSigned :>> ", contentBeingSigned);
      const verify = confirm(
        `Sign content?\n${JSON.stringify(contentBeingSigned)}`
      );
      if (!verify) throw "User did not sign";

      //hash the content, and store the result onchain
      const hash = Web3.utils.keccak256(contentBeingSigned);
      console.log("hash :>> ", hash);
      tx = await contractInstance.methods
        .signHash(hash)
        .send({ from: currentAccount });
      console.log("sign tx", tx);
    } else {
      tx = await contractInstance.methods
        .signTreaty()
        .send({ from: currentAccount });
      console.log("sign tx", tx);
    }

    if (tx.events.SignedByAll != undefined) {
      console.log(
        `Signed by all in block ${tx.blockNumber}. Signature: ${tx.events.SignedByAll.signature}`
      );

      //todo: Replace with code that waits until openSpace is added to state
      console.log("About to wait 2 seconds");
      await delay(2000, "done");
      const openSpace = getState().threebox.openSpace;
      const {
        signedTreatyTextThread,
        unsignedTreatyTextThread,
      } = await sign3boxTreatyText(treaty, openSpace, currentAccount);

      console.log(
        "Signed text is now ",
        await signedTreatyTextThread.getPosts()
      );
      console.log(
        "Unsigned text is now ",
        await unsignedTreatyTextThread.getPosts()
      );
    }

    //SignedByAll
    dispatch(signTreaty(treaty));
    dispatch(loadOneTreaty(contractInstance));
  } catch (e) {
    dispatch(displayAlert(e));
  } finally {
  }
};

export const refreshTreatyRequest = (treaty) => async (dispatch) => {
  console.info("[refreshTreatyRequest] ", treaty);
  loadOneTreaty(treaty.contractInstance);
};

////////////////////
//Sub functions
////////////////////

async function sign3boxTreatyText(treaty, openSpace, myAddress) {
  console.log("openSpace :>> ", openSpace);
  const treatyId = treaty.id;
  const unsignedTreatyTextThread = await openSpace.joinThread(
    `unsigned-treaty-text-${treatyId}`
  );

  console.log(`moderators ${unsignedTreatyTextThread.listModerators()}`);
  const unsignedTreatyText = await unsignedTreatyTextThread.getPosts({
    limit: process.env.THREEBOX_POST_LIMIT,
  });
  const signedTreatyTextThread = await openSpace.joinThread(
    `signed-treaty-text-${treatyId}`
  );
  const existingSignedTreatyText = await signedTreatyTextThread.getPosts({
    limit: process.env.THREEBOX_POST_LIMIT,
  });
  console.log("unsignedTreatyText:", unsignedTreatyText);
  for (var i in unsignedTreatyText) {
    console.log("index# " + i + " lineOfText:", unsignedTreatyText[i]);
    const postResult = await signedTreatyTextThread.post(
      unsignedTreatyText[i].message
    );
    const idToDelete = unsignedTreatyText[i].postId;
    console.log("delete: ", idToDelete);

    const deleteResult = await unsignedTreatyTextThread.deletePost(idToDelete);
    console.log("postResult: ", postResult);
    console.log("deleteResult: ", deleteResult);
  }
  return { signedTreatyTextThread, unsignedTreatyTextThread };
}

export const enrichTreatyWith3boxData = (
  threebox,
  openSpace,
  treaties
) => async (dispatch, getState) => {
  if (treaties == undefined) {
    console.info("treaties undefined");
    dispatch(loadTreatiesSuccess([]));
  }
  const address = getState().web3.account;
  console.log("enrich treaty with auth'd 3box data. treaties: ", treaties);
  const enrichedTreaties = await treaties.map(async (treaty) => {
    return {
      ...treaty,
      unsignedTreatyText: await get3boxUnsignedTreatyText(
        threebox,
        openSpace,
        treaty.id,
        treaty.signers
      ),
      signedTreatyText: await get3boxSignedTreatyText(
        threebox,
        openSpace,
        treaty.id,
        treaty.signers,
        address
      ),
      enrichedWithAuthenticated3box: true,
    };
  });
  console.log("enriched treaties: ", await Promise.all(enrichedTreaties));
  dispatch(loadTreatiesSuccess(await Promise.all(enrichedTreaties)));
};
