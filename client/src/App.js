import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import {
  loadWeb3,
  loadContract,
  loadAccount,
  loadStoredData,
  loadTreatyIndex,
  loadTreatyIndexContract,
  loadTreatyContract,
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
} from "./redux/selectors";
import { subscribeToAccountsChanging } from "./redux/subscriptions";

class App extends Component {
  render() {
    const {
      dispatch,
      contract,
      account,
      value,
      treatyIndex,
      treatyIndexContract,
      onRefreshTreatiesPressed,
    } = this.props;

    const connectBlockchain = async (e) => {
      e.preventDefault();
      const myWeb3 = await loadWeb3(dispatch);
      console.log(myWeb3);
      await loadAccount(dispatch, myWeb3);
      const myContract = await loadContract(dispatch, myWeb3);
      console.log("about to set treaty index contract");
      const treatyIndexContract = await loadTreatyIndexContract(
        dispatch,
        myWeb3
      );
      console.log(treatyIndexContract);
      await loadTreatyIndex(dispatch, treatyIndexContract);
      await loadStoredData(dispatch, myContract);
      subscribeToAccountsChanging(dispatch, myWeb3);
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

    return (
      <div className="container py-2">
        <button
          className="btn btn-success"
          onClick={() => {
            // onRefreshTreatiesPressed(treatyIndexContract);'
            loadTreatyIndex(dispatch, treatyIndexContract);
          }}
        >
          Refresh treaties
        </button>
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
          {treatyIndex &&
            treatyIndex.map((treatyAddress, i) => (
              <tr>
                <td>{i}</td>
                <td>{treatyAddress}</td>
              </tr>
            ))}
        </table>
        <div className="row justify-content-center">
          <div className="col-4">
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
        <div className="row justify-content-center">
          <div className="col-4">
            <label>Account: {account}</label>
            <p>
              Changing accounts in Metamask should refresh this account address
            </p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-4">
            <label>Contract Value: </label>
            <label>{value}</label>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   contract: contractSelector(state),
//   account: accountSelector(state),
//   value: valueSelector(state),
//   treatyIndex: treatyIndexSelector(state),
//   treatyIndexContract: treatyIndexContractSelector(state),
// });

function mapStateToProps(state) {
  return {
    contract: contractSelector(state),
    account: accountSelector(state),
    value: valueSelector(state),
    treatyIndex: treatyIndexSelector(state),
    treatyIndexContract: treatyIndexContractSelector(state),
  };
}

// const mapDispatchToProps = (dispatch) => ({
//   onRefreshTreatiesPressed: (treatyIndexContract) =>
//     dispatch(loadTreatyIndex(treatyIndexContract)),
// });

/*TODO. Better to use mapDispatchToProps.
   At present we are not using this, and instead are attaching the dispatch
   directly to the onClick. */

function mapDispatchToProps(dispatch) {
  return {
    onRefreshTreatiesPressed: (treatyIndexContract) =>
      dispatch(loadTreatyIndex(treatyIndexContract)),
  };
}

export default connect(mapStateToProps)(App);
// export default connect(mapStateToProps, mapDispatchToProps)(App);
// loadWeb3(dispatch);
