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
  load3boxRequest,
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
import {
  subscribeToAccountsChanging,
  subscribeToNewSignatures,
  subscribeToNewTreaties,
  subscribeToAllLogs,
} from "./redux/subscriptions";
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
// import Chatbox from "./components/Chatbox";
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
  startSubscribeToAllLogs,
  startSubscribeToNewTreaties,
  startSubscribeToNewSignatures,
  startLoad3box,
  initiated,
}) => {
  useEffect(() => {
    async function initiate() {
      const myWeb3 = await startLoadWeb3();
      const myAccount = await startLoadAccount(myWeb3);
      const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
      const treatyIndex = await startLoadTreatyIndex(treatyIndexContract);
      const simpleStorageContract = await startLoadContract(myWeb3);
      console.log("simpleStorageContract");
      console.log(simpleStorageContract);
      await startLoadStoredData(simpleStorageContract);
      startSubscribeToAccountsChanging(myWeb3);
      const treaties = await startLoadTreatiesWeb3();
      startSubscribeToAllLogs(web3);
      startSubscribeToNewTreaties();
      startSubscribeToNewSignatures();

      //3box
      // startLoad3box(myAccount, window.ethereum);
      console.log("effect done");
    }
    initiate();
  }, []);

  const connectBlockchain = async (e) => {
    console.log("Deprecated - code removed");
    e.preventDefault();
    // const myWeb3 = await startLoadWeb3();
    // await startLoadAccount(myWeb3);
    // const simpleStorageContract = await startLoadContract(myWeb3);
    // const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
    // await startLoadTreatyIndex(treatyIndexContract);
    // await loadStoredData(simpleStorageContract);
    // subscribeToAccountsChanging(myWeb3);
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
      trigger="hover"
      placement="right"
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
      <LSide>
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
        <p></p>
        {/* <Chatbox /> */}
      </LSide>
      <Main>
        {treatyIndex == null ? (
          <div>Treaty index has not been loaded</div>
        ) : (
          <TreatyList web3={web3} />
        )}
      </Main>
      <RSide>
        <ConnectForm />
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
    startSubscribeToAccountsChanging: (web3) =>
      dispatch(subscribeToAccountsChanging(web3)),
    startLoadStoredData: (contract) => dispatch(loadStoredData(contract)),
    startLoadTreatiesWeb3: (web3, treatyIndex) => dispatch(loadTreatiesWeb3()),
    startSubscribeToNewTreaties: () => dispatch(subscribeToNewTreaties()),
    startSubscribeToNewSignatures: () => dispatch(subscribeToNewSignatures()),
    startSubscribeToAllLogs: (web3) => dispatch(subscribeToAllLogs(web3)),
    startLoad3box: (address, provider) =>
      dispatch(load3boxRequest(address, provider)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatyWeb3);
