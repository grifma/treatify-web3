import { loadAccount } from "./interactions";
import { loadTreatyIndex } from "./interactions";
import { loadOneTreatyByAddress } from "./interactions";

export const subscribeToAccountsChanging = (web3) => async (dispatch) => {
  window.ethereum.on("accountsChanged", async function (accounts) {
    console.log("account changed");
    await dispatch(loadAccount(web3));
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
          console.log(`treaty address is ${result.returnValues[0]}`);
          dispatch(loadOneTreatyByAddress(result.returnValues[0]));
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
    })
    .on("end", function (end) {
      console.info("CONNECTION ENDED", end);
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
  const treaties = getState().treaties.data;
  const treatyInstances = treaties.map((treaty) => treaty.contractInstance);
  treatyInstances.map((treatyInstance) => {
    console.log("treatyInstance", treatyInstance);
    treatyInstance.events
      .SignedBy(
        {
          //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
          // fromBlock: 0,
        },
        function (error, result) {
          if (!error) {
            console.log("[SignedBy]", result);
            dispatch(loadOneTreatyByAddress(result.address));
            return;
          }
          console.error("[SignedBy]", error);
        }
      )
      .on("data", function (event) {
        console.info("[SignedBy]", event);
      })
      .on("error", function (error) {
        console.error("[SignedBy]", error);
      })
      .on("end", function (end) {
        console.info("CONNECTION ENDED", end);
      });
    treatyInstance.events
      .SignHash(
        {
          //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
          // fromBlock: 0,
        },
        function (error, result) {
          if (!error) {
            console.log("[SignHash]", result);
            dispatch(loadOneTreatyByAddress(result.address));
            return;
          }
          console.error("[SignHash]", error);
        }
      )
      .on("data", function (event) {
        console.info("[SignHash]", event);
      })
      .on("error", function (error) {
        console.error("[SignHash]", error);
      })
      .on("end", function (end) {
        console.info("CONNECTION ENDED", end);
      });
  });
};

export const subscribeToRegisterAsSigner = () => async (dispatch, getState) => {
  console.info("subscribeToRegisterAsSigner", getState());
  const treaties = getState().treaties.data;
  const treatyInstances = treaties.map((treaty) => treaty.contractInstance);
  treatyInstances.map((treatyInstance) => {
    console.log("treatyInstance", treatyInstance);
    treatyInstance.events
      .RegisterAsSigner(
        {
          //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
          // fromBlock: 0,
        },
        function (error, result) {
          if (!error) {
            console.log("[RegisterAsSigner]", result);
            dispatch(loadOneTreatyByAddress(result.address));
            return;
          }
          console.error("[RegisterAsSigner]", error);
        }
      )
      .on("data", function (event) {
        console.info("[RegisterAsSigner]", event);
      })
      .on("error", function (error) {
        console.error("[RegisterAsSigner]", error);
      })
      .on("end", function (end) {
        console.info("CONNECTION ENDED", end);
      });
  });
};

export const subscribeToMakeActive = () => async (dispatch, getState) => {
  console.info("subscribeToMakeActive", getState());
  const treaties = getState().treaties.data;
  const treatyInstances = treaties.map((treaty) => treaty.contractInstance);
  treatyInstances.map((treatyInstance) => {
    console.log("treatyInstance", treatyInstance);
    treatyInstance.events
      .MakeActive(
        {
          //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
          // fromBlock: 0,
        },
        function (error, result) {
          if (!error) {
            console.log("[MakeActive]", result);
            dispatch(loadOneTreatyByAddress(result.address));
            return;
          }
          console.error("[MakeActive]", error);
        }
      )
      .on("data", function (event) {
        console.info("[MakeActive]", event);
      })
      .on("error", function (error) {
        console.error("[MakeActive]", error);
      })
      .on("end", function (end) {
        console.info("CONNECTION ENDED", end);
      });
  });
};

export const subscribeTo3boxChanges = () => async (dispatch, getState) => {
  console.info("subscribeTo3boxChanges", getState());
};
