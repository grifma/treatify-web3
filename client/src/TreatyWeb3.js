import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import "./TreatyWeb3.css";
import {
  loadWeb3,
  loadAccount,
  loadContract,
  loadTreatyIndex,
  loadTreatyContract,
  loadTreatyIndexContract,
  loadStoredData,
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
import styled from "styled-components";
import ProfileHover from "profile-hover";

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
      //console.log("simpleStorageContract");
      //console.log(simpleStorageContract);
      await startLoadStoredData(simpleStorageContract);
      startSubscribeToAccountsChanging(myWeb3);
      const treaties = await startLoadTreatiesWeb3();
      startSubscribeToAllLogs(web3);
      startSubscribeToNewTreaties();
      startSubscribeToNewSignatures();

      //3box
      startLoad3box(myAccount, window.ethereum);
      //console.log("effect done");
    }
    initiate();
  }, []);

  const connectBlockchain = async (e) => {
    //console.log("Deprecated - code removed");
    //console.log("web3, treatyIndex", web3, treatyIndex);
    const myWeb3 = await startLoadWeb3();
    const myAccount = await startLoadAccount(myWeb3);
    await startLoadTreatiesWeb3(myWeb3, treatyIndex);

    //3box
    startLoad3box(myAccount, window.ethereum);

    // startLoadWeb3: () => dispatch(loadWeb3()),
    //   startLoadAccount: (myWeb3) => dispatch(loadAccount(myWeb3)),
    //     startLoadContract: (myWeb3) => dispatch(loadContract(myWeb3)),
    //       startLoadTreatyIndex: (treatyIndexContract) =>
    //         dispatch(loadTreatyIndex(treatyIndexContract)),
    //         startLoadTreatyIndexContract: (myWeb3) =>
    //           dispatch(loadTreatyIndexContract(myWeb3)),
    //           startSubscribeToAccountsChanging: (web3) =>
    //             dispatch(subscribeToAccountsChanging(web3)),
    //             startLoadStoredData: (contract) => dispatch(loadStoredData(contract)),
    //               startLoadTreatiesWeb3: (web3, treatyIndex)
    // startLoadWeb3();
    e.preventDefault();
    // const myWeb3 = await startLoadWeb3();
    // await startLoadAccount(myWeb3);
    // const simpleStorageContract = await startLoadContract(myWeb3);
    // const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
    // await startLoadTreatyIndex(treatyIndexContract);
    // await loadStoredData(simpleStorageContract);
    // subscribeToAccountsChanging(myWeb3);
  };

  const refresh = async (e) => {
    //console.log("Refresh");
    startLoadTreatiesWeb3(web3, treatyIndex);
    // loadOneTreatyRequest
    // startLoadWeb3: () => dispatch(loadWeb3()),
    //   startLoadAccount: (myWeb3) => dispatch(loadAccount(myWeb3)),
    //     startLoadContract: (myWeb3) => dispatch(loadContract(myWeb3)),
    //       startLoadTreatyIndex: (treatyIndexContract) =>
    //         dispatch(loadTreatyIndex(treatyIndexContract)),
    //         startLoadTreatyIndexContract: (myWeb3) =>
    //           dispatch(loadTreatyIndexContract(myWeb3)),
    //           startSubscribeToAccountsChanging: (web3) =>
    //             dispatch(subscribeToAccountsChanging(web3)),
    //             startLoadStoredData: (contract) => dispatch(loadStoredData(contract)),
    //               startLoadTreatiesWeb3: (web3, treatyIndex)
    // startLoadWeb3();
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

  const StyledPopover = styled(Popover)`
    min-width: 450px;
    background: #343a40;
    color: white;
    padding: 16px;
  `;

  const StyledPopoverTitle = styled(Popover.Title)`
    min-width: 450px;
    background: #343a40;
    color: white;
    padding: 16px;
  `;

  const treatyIndexPopover = (
    <StyledPopover id="treaty-index-popover">
      <StyledPopoverTitle as="h3">
        Treaty Index Address:{" "}
        {treatyIndexContract && treatyIndexContract._address}
      </StyledPopoverTitle>
      <StyledPopover.Content>
        <TreatyIndexTable />
      </StyledPopover.Content>
    </StyledPopover>
  );

  function renderTreatyIndexPopover(props) {
    <StyledPopover id="treaty-index-popover" {...props}>
      <StyledPopoverTitle as="h3">
        Treaty Index Address:{" "}
        {treatyIndexContract && treatyIndexContract._address}
      </StyledPopoverTitle>
      <StyledPopover.Content>
        <TreatyIndexTable />
      </StyledPopover.Content>
    </StyledPopover>;
  }

  const TreatyIndexComponent = () => (
    <OverlayTrigger
      trigger="hover"
      placement="right"
      delay={{ show: 250, hide: 700 }}
      overlay={treatyIndexPopover}
    >
      <a href="#">Show Treaty Index</a>
    </OverlayTrigger>
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

  const RefreshForm = () => (
    <form onSubmit={refresh}>
      <div className="form-group row">
        <div className="col-12">
          <button type="submit" className="w-100 btn">
            Refresh
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
          <div>
            <ProfileHover address={account} />
          </div>
        )}
        {treatyIndex == null ? (
          <div>Treaty index has not been loaded</div>
        ) : (
          <TreatyIndexComponent />
        )}
        <p></p>
        {/* <Chatbox box={box} title={"Chatbox"} space={space} /> */}
        {/* <Chatbox
          title={"Chatbox"}
          account={account}
          provider={window.ethereum}
        /> */}
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
      dispatch(loadTreatyIndex(treatyIndexContract)),
    startLoadWeb3: () => dispatch(loadWeb3()),
    startLoadAccount: (myWeb3) => dispatch(loadAccount(myWeb3)),
    startLoadContract: (myWeb3) => dispatch(loadContract(myWeb3)),
    startLoadTreatyIndex: (treatyIndexContract) =>
      dispatch(loadTreatyIndex(treatyIndexContract)),
    startLoadTreatyIndexContract: (myWeb3) =>
      dispatch(loadTreatyIndexContract(myWeb3)),
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
