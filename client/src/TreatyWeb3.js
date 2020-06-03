import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import "./TreatyWeb3.css";
import {
  loadWeb3DirectDispatch,
  loadAccountDirectDispatch,
  loadContractDirectDispatch,
  loadTreatyIndexDirectDispatch,
  loadTreatyIndexContractDirectDispatch,
  loadWeb3,
  loadContract,
  loadAccount,
  loadStoredData,
  loadTreatyIndex,
  loadTreatyIndexContract,
  loadTreatyContract,
  loadTreatiesWeb3,
} from "./redux/interactions";
import {
  contractSelector,
  accountSelector,
  valueSelector,
  treatyIndexContractSelector,
  treatyIndexSelector,
  treatyContractSelector,
  treatyContractsSelector,
  treatyIndex,
  web3Selector,
  getState,
} from "./redux/selectors";
import { subscribeToAccountsChanging } from "./redux/subscriptions";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import TreatyList from "./components/TreatyList";

const TreatyWeb3 = ({
  dispatch,
  contract,
  account,
  value,
  treatyIndex,
  treatyIndexContract,
  onRefreshTreatiesPressed,
  web3,
  startLoadWeb3,
  startLoadAccount,
  startLoadContract,
  startLoadTreatyIndex,
  startLoadTreatyIndexContract,
  startSubscribeToAccountsChanging,
  startLoadStoredData,
  startLoadTreatiesWeb3,
  initiated,
}) => {
  useEffect(() => {
    async function initiate() {
      const myWeb3 = await startLoadWeb3();
      await startLoadAccount(myWeb3);
      const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
      const treatyIndex = await startLoadTreatyIndex(treatyIndexContract);

      const simpleStorageContract = await startLoadContract(myWeb3);
      console.log("simpleStorageContract");
      console.log(simpleStorageContract);
      await startLoadStoredData(simpleStorageContract);
      subscribeToAccountsChanging(myWeb3);
      const treaties = await startLoadTreatiesWeb3(myWeb3, treatyIndex);
      console.log("effect done");
    }
    initiate();
  }, []);

  // async function initiate() {
  //   const myWeb3 = await startLoadWeb3();
  //   await startLoadAccount(myWeb3);
  //   const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
  //   await startLoadTreatyIndex(treatyIndexContract);
  // }

  // initiate();
  // console.log("initiate done");

  const connectBlockchain = async (e) => {
    e.preventDefault();
    // const myWeb3 = await loadWeb3(dispatch);
    const myWeb3 = await startLoadWeb3();
    console.log("myWeb3");

    console.log(myWeb3);
    await startLoadAccount(myWeb3);
    const simpleStorageContract = await startLoadContract(myWeb3);
    console.log("about to set treaty index contract");
    const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
    console.log(treatyIndexContract);
    await startLoadTreatyIndex(treatyIndexContract);
    await loadStoredData(simpleStorageContract);
    subscribeToAccountsChanging(myWeb3);
  };

  console.log("contract");
  console.log(contract);
  console.log("dispatch");
  console.log(dispatch);
  console.log("treaty index");
  console.log(treatyIndex);
  console.log("value");
  console.log(value);
  console.log("treatyIndexContract");
  console.log(treatyIndexContract);

  const loadingMessage = <div>Loading treaties</div>;
  const isLoading = false;
  const content = (
    //router <Router>
    <div className="container py-2">
      <div className="flexbox">
        <div>
          <div>
            Treaty Index Address:{" "}
            {treatyIndexContract && treatyIndexContract._address}
          </div>
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Contract Address</th>
              </tr>
            </thead>
            <tbody>
              {treatyIndex &&
                treatyIndex.map((treatyAddress, i) => (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>{treatyAddress}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <TreatyList />
      <div className="row">
        <div className="col-6">
          <form onSubmit={connectBlockchain}>
            <div className="form-group row">
              <div className="col-12">
                <button
                  type="submit"
                  className={`w-100 btn text-truncate ${
                    contract !== null ? "disabled btn-success" : "btn-danger"
                  }`}
                >
                  {contract !== null
                    ? "Blockchain Connected"
                    : "Connect Blockchain"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Account: {account}</label>
        </div>
      </div>
    </div>
    //router<Switch>
    //router<Route
    // exact
    // path="/treatify"
    // render={(props) => {
    //  let x = "whatever"
    // return <TreatyList props={props} />;
    // }}
    //router/>

    //router<Route
    //routerexact
    //       path="/hello"
    //       render={(props) => {
    //         return (
    //           <div>
    //             <h1>Hello</h1>
    //           </div>
    //         );
    //       }}
    //     />
    //   </Switch>
    // </Router>
  );
  return isLoading ? loadingMessage : content;
};

// const mapStateToProps = (state) => ({
//   contract: contractSelector(state),
//   account: accountSelector(state),
//   value: valueSelector(state),
//   treatyIndex: treatyIndexSelector(state),
//   treatyIndexContract: treatyIndexContractSelector(state),
//   web3: web3Selector(state),
// });

function mapStateToProps(state) {
  return {
    contract: contractSelector(state),
    account: accountSelector(state),
    value: valueSelector(state),
    treatyIndex: treatyIndexSelector(state),
    treatyIndexContract: treatyIndexContractSelector(state),
    web3: web3Selector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRefreshTreatiesPressed: (treatyIndexContract) =>
      dispatch(loadTreatyIndexDirectDispatch(treatyIndexContract)),
    startLoadWeb3: () => dispatch(loadWeb3DirectDispatch()),
    startLoadAccount: (myWeb3) => dispatch(loadAccountDirectDispatch(myWeb3)),
    startLoadContract: (myWeb3) => dispatch(loadContractDirectDispatch(myWeb3)),
    startLoadTreatyIndex: (treatyIndexContract) =>
      dispatch(loadTreatyIndexDirectDispatch(treatyIndexContract)),
    startLoadTreatyIndexContract: (myWeb3) =>
      dispatch(loadTreatyIndexContractDirectDispatch(myWeb3)),
    startSubscribeToAccountsChanging: () =>
      dispatch(subscribeToAccountsChanging()),
    startLoadStoredData: (contract) => dispatch(loadStoredData(contract)),
    startLoadTreatiesWeb3: (web3, treatyIndex) =>
      dispatch(loadTreatiesWeb3(web3, treatyIndex)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatyWeb3);
