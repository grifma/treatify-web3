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
  hideTreaties,
  showAllTreaties,
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
import { getHiddenTreaties } from "./selectors";
import { delay } from "../utility/helperFunctions";
require("events").EventEmitter.defaultMaxListeners = 50;

async function pullTreaty(treatyInstance, threebox, openSpace, address) {
  // console.info("[pullTreaty]", treatyInstance, threebox, openSpace);
  const numUnsigned = await treatyInstance.methods.getNumUnsigned().call();
  const numSigned = await treatyInstance.methods.getNumSigned().call();
  const numSigners = await treatyInstance.methods.getNumSignatures().call();
  const treatyId = Number(await treatyInstance.methods.id().call());

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
      threebox,
      openSpace,
      treatyId,
      signers
    ),
    signedTreatyText: await getSignedTreatyText(
      threebox,
      openSpace,
      treatyId,
      signers,
      address
    ),
    address: await treatyInstance._address,
    contractInstance: treatyInstance,
    developerInfo: await get3boxDeveloperInfo(treatyId, openSpace),
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

async function getUnsignedTreatyText(threebox, openSpace, treatyId, signers) {
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

async function getSignedTreatyText(
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
  dispatch(treatyContractLoaded(ethersInstance));
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

export const hideTreatyRequest = (ids) => async (dispatch, getState) => {
  console.log("[hideTreatyRequest] with ids " + ids);
  if (typeof ids == "number") {
    dispatch(hideTreaties([ids]));
  } else {
    dispatch(hideTreaties(ids));
  }
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
    dispatch(alert(e));
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
    dispatch(alert(e));
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
    const openSpace = getState().threebox.openSpace;
    const thread = await openSpace.joinThread(
      `unsigned-treaty-text-${treaty.id}`
    );
    console.log("created thread with id ", `unsigned-treaty-text-${treaty.id}`);

    treaty.signers.map(async (x) => {
      await thread.addModerator(x);
      console.log(`added ${x} as thread moderator`);
    });
    dispatch(loadOneTreaty(contractInstance));
  } catch (e) {
    dispatch(alert(e));
  } finally {
  }
};

export const joinTreatyRequest = (treaty) => async (dispatch, getState) => {
  console.info("[joinTreatyRequest] for: ", treaty);
  const { id, address, contractInstance } = treaty;
  console.info("contractInstance", contractInstance);
  const currentAccount = getState().web3.account;
  const web3 = getState().web3.connection;
  try {
    const tx = await contractInstance.methods
      .registerAsSigner()
      .send({ from: currentAccount });
    console.log("tx", tx);
    dispatch(joinTreaty(treaty));
    dispatch(loadOneTreaty(contractInstance));
  } catch (e) {
    console.error(e);
    dispatch(alert(e));
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
    dispatch(addToTreatyIndexRequest(contract));
    dispatch(loadOneTreatyByAddress(contract.address));
  } catch (e) {
    console.log("[addTreatyRequest] ERROR", e);
    dispatch(alert(e));
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
    dispatch(alert(e));
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

    const tx = await contractInstance.methods
      .writeToTreaty(text)
      .send({ from: currentAccount });

    const threebox = getState().threebox.threebox;
    const openSpace = getState().threebox.openSpace;

    if (openSpace == null) throw "Space is not open";

    const unsignedTreatyTextThread = await openSpace.joinThread(
      `unsigned-treaty-text-${treaty.id}`
    );
    console.log("joined thread with id ", `unsigned-treaty-text-${treaty.id}`);

    const unsignedTreatyText = await unsignedTreatyTextThread.getPosts({
      limit: process.env.THREEBOX_POST_LIMIT,
    });

    const postResult = await unsignedTreatyTextThread.post(text);
    console.log("posted: ", text);
    console.log(`postResult: ${postResult}`);

    try {
      console.log(`moderators: ${unsignedTreatyTextThread.listModerators()}`);
    } catch (e) {
      console.error("Error listing modertors ", e);
    }
    console.log(`posts: `);
    console.log(unsignedTreatyTextThread.getPosts());

    dispatch(addTextToTreaty(treaty, text));

    dispatch(loadOneTreaty(contractInstance));
  } catch (e) {
    dispatch(alert(e));
  }
};

export const signTreatyRequest = (treaty) => async (dispatch, getState) => {
  const { id, address, contractInstance } = treaty;
  const currentAccount = getState().web3.account;
  try {
    let tx;
    const threebox = getState().threebox.threebox;
    const openSpace = getState().threebox.openSpace;
    console.log("threebox :>> ", threebox);
    console.log("openSpace :>> ", openSpace);
    console.log("id :>> ", id);
    const contentBeingSigned = await getUnsignedTreatyText(
      threebox,
      openSpace,
      id
    );
    console.log("contentBeingSigned :>> ", contentBeingSigned);
    const verify = confirm(
      `Sign content?\n${JSON.stringify(contentBeingSigned)}`
    );
    if (!verify) throw "User did not sign";

    // hash the content, and store the result onchain
    const hash = Web3.utils.keccak256(contentBeingSigned);
    console.log("hash :>> ", hash);
    tx = await contractInstance.methods
      .signHash(hash)
      .send({ from: currentAccount });
    console.log("sign tx", tx);

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
    dispatch(signTreaty(treaty));
    dispatch(loadOneTreaty(contractInstance));
  } catch (e) {
    dispatch(alert(e));
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
      unsignedTreatyText: await getUnsignedTreatyText(
        threebox,
        openSpace,
        treaty.id,
        treaty.signers
      ),
      signedTreatyText: await getSignedTreatyText(
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
