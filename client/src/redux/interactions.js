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
require("events").EventEmitter.defaultMaxListeners = 50;

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
const THREEBOX_POST_LIMIT = 20;

const ID_SIZE = 6;
//
///////////////////////////////////

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

async function pullTreaty(treatyInstance, threebox, openSpace) {
  console.info("[pullTreaty]", treatyInstance, threebox, openSpace);

  const numUnsigned = await treatyInstance.methods.getNumUnsigned().call();
  const numSigned = await treatyInstance.methods.getNumSigned().call();
  const numSigners = await treatyInstance.methods.getNumSignatures().call();
  const treatyId = await treatyInstance.methods.id().call();

  console.log(
    `[pullTreaty] there are ${numSigners} signers. This is treaty #${treatyId}`
  );

  const signers = [];
  var i;
  for (i = 0; i < numSigners; i++) {
    signers.push(await treatyInstance.methods.signatureList(i).call());
    console.log("[pullTreaty] signer pushed");
  }

  console.log("pullTreaty] signers: :>> ", signers);
  const treaty = {
    id: treatyId,
    text: await treatyInstance.methods.name().call(),
    isCompleted: (await treatyInstance.methods.treatyState().call()) == 1,
    createdAt: await treatyInstance.methods.creationTime().call(),
    signers: await getFor(numSigners, getSigner, treatyInstance),
    //TODO: Retreive state of signature. signatureStatus: signers && signers.map((signer) => async ( humanReadableSignatureStatus(await treatyInstance.methods.signatureState(signer).call()) )),
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
      signers
    ),
    address: await treatyInstance._address,
    contractInstance: treatyInstance,
  };
  return treaty;
}

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
  //console.log("getFor returning: ", result);
  return result;
}

//todo: Refactor this -- half of the args are unused in each case
async function getUnsignedTreatyText(
  numUnsigned,
  getUnsignedText,
  treatyInstance,
  threebox,
  openSpace,
  treatyId,
  signers
) {
  switch (TREATY_TEXT_PERSIST_MODE) {
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

//todo: Refactor this -- half of the args are unused in each case
async function getSignedTreatyText(
  numSigned,
  getSignedText,
  treatyInstance,
  threebox,
  openSpace,
  treatyId,
  signers
) {
  switch (TREATY_TEXT_PERSIST_MODE) {
    case PersistMode.THREEBOX:
      console.log("Case: THREEBOX");
      return await get3boxSignedTreatyText(
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
      return await getFor(numSigned, getSignedText, treatyInstance);
  }
}

async function get3boxUnsignedTreatyText(
  threebox,
  openSpace,
  treatyId,
  signers
) {
  console.log(`Treaty id is ${treatyId}`);
  console.log("threadName: ", `unsigned-treaty-text-${treatyId}`);
  console.log("signers :>> ", signers);

  try {
    if (openSpace != undefined) {
      console.info(`#${treatyId}Logged in, using joinThread()`);
      const thread = await openSpace.joinThread(
        `unsigned-treaty-text-${treatyId}`
      );

      const posts = await thread.getPosts({
        limit: THREEBOX_POST_LIMIT,
      });
      return posts.map((x) => x.message);
    } else {
      //This is more complex that it should be because we don't know the firstModerator of the thread
      console.info(`#${treatyId} Not logged in, using getThread()`);

      //In order to access the thread before we are authenticated (~ 6 seconds), 3box requires us to know the first moderator of the thread
      //As we know it is one of the signers, we try getThread with each signer
      // const posts = signers
      //   .map(async (signer) => {
      //     await Box.getThread(
      //       "treatify",
      //       `unsigned-treaty-text-${treatyId}`,
      //       signer,
      //       false
      //     );
      //   })
      //   .filter((posts) => posts.length > 0)[0];

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

      const postsUndefined = postsBySigner.filter((x) => x == postsUndefined);

      var posts;

      if (postsUndefined.length == postsBySigner.length) {
        console.log("all posts are undefined, returning empty list");
        return [];
      } else {
        console.log("postsBySigner", postsBySigner);

        const postsBySignerEmptyFiltered = postsBySigner.filter(
          (x) => x.length > 0
        );
        console.log(
          "postsBySignerEmptyFiltered :>> ",
          postsBySignerEmptyFiltered
        );

        posts = postsBySignerEmptyFiltered[0];
        console.log(`[allUndefined]::[unsigned] posts for #${treatyId}`, posts);
        // const posts = postsBySigner.filter((x) => x.length > 0)[0];

        if (postsBySignerEmptyFiltered > 0) {
          console.error(
            "There should only be one filter match. Only one signer is the first moderator.",
            posts
          );
        }
      }

      // const posts = await Box.getThread(
      //   "treatify",
      //   `unsigned-treaty-text-${treatyId}`,
      //   "0x01d0ef4e369bac36ee55f75d3273745f21d6b239",
      //   false
      // );
      // const thread = await Box.getThread(
      //   "treatify",
      //   `unsigned-treaty-text-${treatyId}`,
      //   {
      //     firstModerator: "0x01d0ef4E369bAc36EE55f75d3273745F21D6B239",
      //     members: false,
      //   }
      // );
      // console.log(thread);
      // const posts = await thread.getPosts();
      // const posts = hardcodedUnsignedThread;
      // const posts = await Box.getThread(
      //   "treatify",
      //   `unsigned-treaty-text-${treatyId}`
      // );
      console.log(`[unsigned] posts for #${treatyId}`, posts);
      if (posts == postsUndefined) {
        console.log(
          `treaty #${treatyId}, posts are undefined. Returning empty list.`
        );
        return [];
      }
      console.log(`Treaty id  ${treatyId} has ${posts.length} posts`);

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

async function get3boxSignedTreatyText(threebox, openSpace, treatyId, signers) {
  console.log(`Treaty id is ${treatyId}`);
  console.log("threadName: ", `signed-treaty-text-${treatyId}`);
  console.log("signers :>> ", signers);
  //ACTIVE BEFORE 20 JUNE 2020
  // const posts = await Box.getThread(
  //   "treatify",
  //   `signed-treaty-text-${treatyId}`,
  //   "0x01d0ef4e369bac36ee55f75d3273745f21d6b239",
  //   false
  //   );
  // console.log(`[signed] posts for #${treatyId}`, posts);

  // if (treatyId == 1) {
  //   return [`Hiding ${posts.length} lines`];
  //   console.log("posts", posts);
  // }

  // return posts.map((post) => {
  //   return post.message;
  // });
  //END OF ACTIVE BEFORE 20 JUNE 2020

  try {
    if (openSpace != undefined) {
      console.info(`#${treatyId}Logged in, using joinThread()`);
      const thread = await openSpace.joinThread(
        `signed-treaty-text-${treatyId}`
      );

      const posts = await thread.getPosts({
        limit: THREEBOX_POST_LIMIT,
      });
      return posts.map((x) => x.message);
    } else {
      //This is more complex that it should be because we don't know the firstModerator of the thread
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
      console.log(
        `#${treatyId} 1st map done. postsBySigner :>> `,
        postsBySigner
      );
      const undefined = postsBySigner.filter((x) => x == undefined);

      const allUndefined = undefined.length == postsBySigner.length;

      var posts;

      if (allUndefined) {
        console.log("all posts are undefined, returning empty list");
        return [];
      } else {
        console.log("postsBySigner", postsBySigner);

        const postsBySignerEmptyFiltered = postsBySigner.filter(
          (x) => x.length > 0
        );
        console.log(
          "postsBySignerEmptyFiltered :>> ",
          postsBySignerEmptyFiltered
        );

        posts = postsBySignerEmptyFiltered[0];
        console.log(`[allUndefined]::[unsigned] posts for #${treatyId}`, posts);
        // const posts = postsBySigner.filter((x) => x.length > 0)[0];

        if (postsBySignerEmptyFiltered > 0) {
          console.error(
            "There should only be one filter match. Only one signer is the first moderator.",
            posts
          );
        }
      }

      // const posts = await Box.getThread(
      //   "treatify",
      //   `unsigned-treaty-text-${treatyId}`,
      //   "0x01d0ef4e369bac36ee55f75d3273745f21d6b239",
      //   false
      // );
      // const thread = await Box.getThread(
      //   "treatify",
      //   `unsigned-treaty-text-${treatyId}`,
      //   {
      //     firstModerator: "0x01d0ef4E369bAc36EE55f75d3273745F21D6B239",
      //     members: false,
      //   }
      // );
      // console.log(thread);
      // const posts = await thread.getPosts();
      // const posts = hardcodedUnsignedThread;
      // const posts = await Box.getThread(
      //   "treatify",
      //   `unsigned-treaty-text-${treatyId}`
      // );
      console.log(`[unsigned] posts for #${treatyId}`, posts);
      if (posts == undefined) {
        console.log(
          `treaty #${treatyId}, posts are undefined. Returning empty list.`
        );
        return [];
      }
      console.log(`Treaty id  ${treatyId} has ${posts.length} posts`);

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
  //   limit: THREEBOX_POST_LIMIT,
  // });
}

////////////////////
// Load functions
////////////////////

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

export const loadTreatyIndexContract = (web3) => async (dispatch) => {
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

export const loadTreatyIndex = (contract) => async (dispatch) => {
  const treatyIndex = await contract.methods.getTreatyIndex().call();
  dispatch(treatyIndexLoaded(treatyIndex));
  return treatyIndex;
};

export const loadStoredData = (contract) => async (dispatch) => {
  const value = await contract.methods.get().call();
  dispatch(valueLoaded(value));
  return value;
};

export const loadTreatiesWeb3 = (/*web3, treatyIndex*/) => async (
  dispatch,
  getState
) => {
  try {
    const web3 = getState().web3.connection;
    const threebox = getState().threebox.threebox;
    const openSpace = getState().threebox.openSpace;

    const treatyIndex = getState().contract.treatyIndex;

    dispatch(loadTreatiesInProgress());
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = TreatyContract.networks[networkId];

    const treatyInstances = treatyIndex.map((treatyAddress) => {
      return new web3.eth.Contract(TreatyContract.abi, treatyAddress);
    });

    const treaties = await Promise.all(
      treatyInstances.map(async (treatyInstance) => {
        const numUnsigned = await treatyInstance.methods
          .getNumUnsigned()
          .call();
        const numSigned = await treatyInstance.methods.getNumSigned().call();
        const numSigners = await treatyInstance.methods
          .getNumSignatures()
          .call();
        const treaty = await pullTreaty(treatyInstance, threebox, openSpace);
        return treaty;
      })
    );
    dispatch(loadTreatiesSuccess(treaties));
    dispatch(enrichTreatyWith3boxData(threebox, openSpace, treaties));
  } catch (e) {
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

export const loadOneTreaty = (treatyInstance) => async (dispatch, getState) => {
  console.log("[loadOneTreaty] ", treatyInstance);
  try {
    dispatch(loadOneTreatyInProgress());
    const threebox = getState().threebox.threebox;
    const openSpace = getState().threebox.openSpace;
    console.log(
      "[loadOneTreaty] Parse treaty with ",
      treatyInstance,
      threebox,
      openSpace
    );
    const treaty = await pullTreaty(treatyInstance, threebox, openSpace);
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
    dispatch(
      enrichTreatyWith3boxData(
        box,
        treatifySpace,
        await getState().treaties.data
      )
    );
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
    //console.log("tx");
    //console.log(tx);
    await dispatch(markActive(treaty));

    //If using 3box, make all registered signers moderators of the 3box thread
    if (TREATY_TEXT_PERSIST_MODE == PersistMode.THREEBOX) {
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

    // const response = await fetch(`${treatyServer}/treaties/${id}/active`, {
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
  //console.log("joinRequest for: ", treaty);
  const { id, address, contractInstance } = treaty;
  const currentAccount = getState().web3.account;
  const web3 = getState().web3.connection;
  //console.log("contractInstance", contractInstance);
  //console.log("currentAccount", currentAccount);
  //console.log("web3", web3);
  try {
    const tx = await contractInstance.methods
      .registerAsSigner()
      .send({ from: currentAccount });

    dispatch(joinTreaty(treaty));
    dispatch(loadOneTreaty(contractInstance));
    // const response = await fetch(`${treatyServer}/treaties/${id}/active`, {
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

export const addTreatyRequest = (text) => async (dispatch, getState) => {
  try {
    console.info("[addTreatyRequest]");
    var freshWeb3 = new Web3(Web3.givenProvider);

    const treatyContract1 = web3.eth.contract(TreatyContract.abi);
    //console.log(treatyContract1);

    const currentAccount = getState("web3").web3.account;
    const contractCode = "0x" + TreatyBin.bin;

    const parameters = TreatyContract.abi;
    console.log(`[addTreatyRequest] About to deploy  ${text} . . .`);

    var _id = Math.floor(Math.random() * 10 ** ID_SIZE);
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
        console.info(e, contract);
        if (typeof contract.address !== "undefined") {
          console.log(
            "Contract mined! address: " +
              contract.address +
              " transactionHash: " +
              contract.transactionHash
          );
          dispatch(addToTreatyIndexRequest(contract));
          dispatch(loadOneTreaty(contract));
          // dispatch(createTreaty(contract)); //no longer needed as added inside loadOneTreaty
        }
      }
    );
  } catch (e) {
    //console.log("[addTreatyRequest] ERROR", e);
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
    dispatch(loadOneTreaty(treatyInstance));
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

    console.log("mode", TREATY_TEXT_PERSIST_MODE);
    switch (TREATY_TEXT_PERSIST_MODE) {
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
          limit: THREEBOX_POST_LIMIT,
        });
        //console.log("thread says: ", unsignedTreatyText);

        //add a post
        const postResult = await unsignedTreatyTextThread.post(text);
        console.log("posted: ", text);
        console.log(`postResult: ${postResult}`);
        console.log(`moderators: ${unsignedTreatyTextThread.listModerators()}`);
        console.log(`posts: `);
        console.log(unsignedTreatyTextThread.getPosts());
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
    // if (TREATY_TEXT_PERSIST_MODE == PersistMode.THREEBOX) {
    //   const threebox = getState().threebox.threebox;
    //   const openSpace = getState().threebox.openSpace;
    //   const contentBeingSigned = get3boxUnsignedTreatyText(
    //     threebox,
    //     openSpace,
    //     id
    //   );

    //   //show this content in a modal for verification
    //   //hash the content, and store the result onchain
    //   //we need to convert contentToBeSigned to bytes32, as this is what the contract expects
    //   //web3.fromAscii may work
    //   const hash = await contractInstance.methods
    //     .calcSHA3(contentBeingSigned)
    //     .call();
    //   console.log("hash");
    //   console.log(hash);

    //   //is this hash already saved on the contract?
    //   const verify = confirm("Sign content?");
    //   if (!verify) throw "User did not sign";

    //   const onchainHash = await contractInstance.methods
    //     .getUnsignedTreatyText(0)
    //     .call();

    //   if (onchainHash == hash) {
    //     console.log("this hash is already onchain");
    //   } else {
    //     console.log("adding hash to chain");
    //     const addHashTx = await contractInstance.methods
    //       .addTextToTreaty(hash)
    //       .send({ from: currentAccount });
    //     console.log("addHashTx");
    //     console.log(addHashTx);
    //   }
    // }

    const tx = await contractInstance.methods
      .signTreaty()
      .send({ from: currentAccount });
    console.log("tx");
    console.log(tx);

    const signTransactionBlock = tx.blockNumber;

    //if we are using 3box,
    //and this is the last signature needed to sign,
    //we will need to move the unsigned thread to the signed thread
    console.log("tx.events");
    console.log(tx.events);

    if (tx.events.SignedByAll != undefined) {
      console.log(
        `Signed by all. Signature: ${tx.events.SignedByAll.signature}`
      );

      //todo: Replace with code that waits until openSpace is added to state
      console.log("About to wait 6 seconds");
      await delay(6000, "done");
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
    limit: THREEBOX_POST_LIMIT,
  });
  const signedTreatyTextThread = await openSpace.joinThread(
    `signed-treaty-text-${treatyId}`
  );
  const existingSignedTreatyText = await signedTreatyTextThread.getPosts({
    limit: THREEBOX_POST_LIMIT,
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
        treaty.signers
      ),
      enrichedWithAuthenticated3box: true,
    };
  });
  console.log("enriched treaties: ", await Promise.all(enrichedTreaties));
  dispatch(loadTreatiesSuccess(await Promise.all(enrichedTreaties)));
};
