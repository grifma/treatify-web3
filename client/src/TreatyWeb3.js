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
import Blockies from "react-blockies";
import {
  Main,
  LSide,
  RSide,
  Header,
  Footer,
  Grid,
} from "./components/treatifyStyled";
import Nav from "./components/Nav";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";

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
      const treaties = await startLoadTreatiesWeb3();
      console.log("effect done");
    }
    initiate();
  }, []);

  const connectBlockchain = async (e) => {
    e.preventDefault();
    const myWeb3 = await startLoadWeb3();
    await startLoadAccount(myWeb3);
    const simpleStorageContract = await startLoadContract(myWeb3);
    const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
    await startLoadTreatyIndex(treatyIndexContract);
    await loadStoredData(simpleStorageContract);
    subscribeToAccountsChanging(myWeb3);
  };

  const emptyComponent = () => <div>EMPTY</div>;

  const TreatyIndexTable = () => (
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
  );

  const treatyIndexPopover = (
    <Popover id="treaty-index-popover">
      <Popover.Title as="h3">
        Treaty Index Address:{" "}
        {treatyIndexContract && treatyIndexContract._address}
      </Popover.Title>
      <Popover.Content>
        <TreatyIndexTable />
      </Popover.Content>
    </Popover>
  );

  const TreatyIndexComponent = () => (
    <OverlayTrigger
      trigger="hover focus"
      placement="left"
      overlay={treatyIndexPopover}
    >
      <div class="onDark">Treaty Index</div>
    </OverlayTrigger>
  );

  const AccountBlockie = () => (
    <div class="onDark">
      <Blockies seed={account.toLowerCase()} size={10} scale={6} />
      &nbsp;&nbsp;&nbsp;
      <label>Account: {account}</label>
    </div>
  );

  const ConnectForm = () => (
    <form onSubmit={connectBlockchain}>
      <div className="form-group row">
        <div className="col-12">
          <button
            type="submit"
            className={`w-100 btn text-truncate ${
              contract !== null ? "disabled btn-success" : "btn-danger"
            }`}
          >
            {contract !== null ? "Blockchain Connected" : "Connect Blockchain"}
          </button>
        </div>
      </div>
    </form>
  );

  const loadingMessage = <div>Loading treaties</div>;
  const isLoading = false;
  const content = (
    <Grid>
      <Header>
        <Nav />
      </Header>
      <LSide></LSide>
      <Main>
        {treatyIndex == null ? (
          <div>Treaty index has not been loaded</div>
        ) : (
          <TreatyList web3={web3} />
        )}
      </Main>
      <RSide>
        <ConnectForm />
        {account == null ? (
          <div>Account has not been loaded</div>
        ) : (
          <AccountBlockie />
        )}
        {treatyIndex == null ? (
          <div>Treaty index has not been loaded</div>
        ) : (
          <TreatyIndexComponent />
        )}
      </RSide>
      <Footer></Footer>
    </Grid>
  );
  return isLoading ? loadingMessage : content;
};

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
    startLoadTreatiesWeb3: (web3, treatyIndex) => dispatch(loadTreatiesWeb3()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatyWeb3);
