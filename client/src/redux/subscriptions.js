import { loadAccount } from "./interactions";
import { loadTreatyIndex } from "./interactions";

export const subscribeToAccountsChanging = (web3) => async (dispatch) => {
  window.ethereum.on("accountsChanged", async function (accounts) {
    console.log("account changed");
    await dispatch(loadAccountDirectDispatch(web3));
  });
};

export const subscribeToNewTreaties = () => async (dispatch, getState) => {
  console.info("subscribeToNewTreaty", getState());
  const treatyIndexInstance = getState().contract.treatyIndexContract;
  console.log("treatyIndexInstance", treatyIndexInstance);

  treatyIndexInstance.events
    .AddTreaty(
      {
        //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
        // fromBlock: 0,
      },
      function (error, result) {
        if (!error) {
          console.log("[subscribeToNewTreaties]", result);
          return;
        }
        console.error("[subscribeToNewTreaties]", error);
      }
    )
    .on("data", function (event) {
      console.info("[subscribeToNewTreaties]", event);
    })
    .on("error", function (error) {
      console.error("[subscribeToNewTreaties]", error);
    });
};

export const subscribeToAllLogs = (web3) => async (dispatch, getState) => {
  // web3.eth
  //   .subscribe("logs", function (error, result) {
  //     if (!error) {
  //       console.log("[alllogs]", result);
  //       return;
  //     }
  //     console.error("[alllogs]", error);
  //   })
  //   .on("data", function (event) {
  //     console.info("[alllogs]", event);
  //   })
  //   .on("error", console.error("[alllogs]", error));
  // window.ethereum.on("AddTreaty", async function (accounts) {
  //   console.log("EVENT DETECTED, AddTreaty: ", null);
  //   await dispatch(loadTreatyIndex(web3));
  // });
};

export const subscribeToNewSignatures = () => async (dispatch, getState) => {
  console.info("SignedBy", getState());
  const treatyIndexInstance = getState().contract.treatyIndexContract;
  console.log("treatyIndexInstance", treatyIndexInstance);
  treatyIndexInstance.events
    .AddTreaty(
      {
        //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
        // fromBlock: 0,
      },
      function (error, result) {
        if (!error) {
          console.log("[SignedBy]", result);
          return;
        }
        console.error("[SignedBy]", error);
      }
    )
    .on("data", function (event) {
      console.info("[SignedBy]", event);
    })
    .on("error", function (error) {
      console.error("[subscribeToNewTreaties]", error);
    });
};

export const subscribeSet = (web3) => async (dispatch) => {
  window.ethereum.on("Set", async function (accounts) {
    console.log("SUBSCRIBE--SET");
  });
};
