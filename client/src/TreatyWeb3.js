import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import "./TreatyWeb3.css";
import {
  loadWeb3,
  loadEthersProvider,
  loadEthersSigner,
  loadAccount,
  loadTreatyIndex,
  loadTreatyIndexWeb3,
  loadTreatyContract,
  loadTreatyIndexContract,
  loadTreatyIndexContractWeb3,
  loadStoredData,
  loadTreatiesWeb3,
  load3box,
} from "./redux/interactions";
import {
  accountSelector,
  treatyIndexContractSelector,
  treatyIndexSelector,
  treatyContractSelector,
  treatyContractsSelector,
  treatyIndex,
  web3Selector,
  ethersProviderSelector,
  ethersSignerSelector,
} from "./redux/selectors";
import {
  subscribeToAccountsChanging,
  subscribeToNewSignatures,
  subscribeToNewTreaties,
  subscribeToMakeActive,
  subscribeToRegisterAsSigner,
  subscribeToAllLogs,
} from "./redux/subscriptions";

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
import { StyledPopover, StyledPopoverTitle } from "./components/treatifyStyled";
// import Chatbox from "./components/Chatbox";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import styled from "styled-components";
import ProfileHover from "profile-hover";
import ActiveTreatyListItem from "./components/ActiveTreatyListItem";
import { withCookies } from "react-cookie";

const TreatyWeb3 = ({
  dispatch,
  account,
  value,
  treatyIndex,
  treatyIndexContract,
  onRefreshTreatiesPressed,
  web3,
  startLoadWeb3,
  startLoadAccount,
  startLoadTreatyIndex,
  startLoadTreatyIndexContract,
  startSubscribeToAccountsChanging,
  startLoadStoredData,
  startLoadTreatiesWeb3,
  startSubscribeToAllLogs,
  startSubscribeToNewTreaties,
  startSubscribeToNewSignatures,
  startSubscribeToMakeActive,
  startSubscribeToRegisterAsSigner,
  startLoad3box,
  startLoadEthersProvider,
  startLoadEthersSigner,
  initiated,
  cookies,
}) => {
  useEffect(() => {
    async function initiate() {
      //ethers
      const provider = await startLoadEthersProvider(window.ethereum);
      const signer = await startLoadEthersSigner(provider);
      console.log("provider :>> ", provider);
      console.log("signer :>> ", signer);
      const myWeb3 = await startLoadWeb3();
      const myAccount = await startLoadAccount(myWeb3);
      const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
      const treatyIndex = await startLoadTreatyIndex(treatyIndexContract);
      startSubscribeToAccountsChanging(myWeb3);
      const treaties = await startLoadTreatiesWeb3(myWeb3, treatyIndex);
      console.log("treaties :>>> ", treaties);
      startSubscribeToAllLogs(web3);
      startSubscribeToNewTreaties();
      startSubscribeToNewSignatures();
      startSubscribeToRegisterAsSigner();
      startSubscribeToMakeActive();

      //3box
      startLoad3box(myAccount, window.ethereum);
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

    e.preventDefault();
  };

  const refresh = async (e) => {
    //console.log("Refresh");
    startLoadTreatiesWeb3(web3, treatyIndex);
    e.preventDefault();
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
    <StyledPopover id="treaty-index-popover" boundary="window">
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
      trigger={["hover", "focus"]}
      placement={"right"}
      delay={{ show: 250, hide: 2000 }}
      overlay={treatyIndexPopover}
    >
      <a href="#" style={{ marginTop: "40px" }}>
        Show Treaty Index
      </a>
    </OverlayTrigger>
  );

  const ConnectForm = () => (
    <form onSubmit={connectBlockchain}>
      <div className="form-group row">
        <div className="col-12">
          <button
            type="submit"
            className={`w-100 btn text-truncate ${
              treatyIndexContract !== null
                ? "disabled btn-success"
                : "btn-danger"
            }`}
          >
            {treatyIndexContract !== null
              ? "Blockchain Connected"
              : "Connect Blockchain"}
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
      <Header>{/*<Nav />*/}</Header>
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
      </LSide>
      <Main>
        {treatyIndex == null ? (
          <div>Treaty index has not been loaded</div>
        ) : (
          <TreatyList web3={web3} pCookies={cookies} />
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
    web3: web3Selector(state),
    account: accountSelector(state),
    treatyIndex: treatyIndexSelector(state),
    treatyIndexContract: treatyIndexContractSelector(state),
    ethersProvider: ethersProviderSelector(state),
    ethersSigner: ethersSignerSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRefreshTreatiesPressed: (treatyIndexContract) =>
      dispatch(loadTreatyIndex(treatyIndexContract)),
    startLoadWeb3: () => dispatch(loadWeb3()),
    startLoadAccount: (myWeb3) => dispatch(loadAccount(myWeb3)),
    startLoadTreatyIndex: (treatyIndexContract) =>
      dispatch(loadTreatyIndexWeb3(treatyIndexContract)),
    startLoadTreatyIndexContract: (myWeb3) =>
      dispatch(loadTreatyIndexContractWeb3(myWeb3)),
    startSubscribeToAccountsChanging: (web3) =>
      dispatch(subscribeToAccountsChanging(web3)),
    startLoadTreatiesWeb3: (web3, treatyIndex) => dispatch(loadTreatiesWeb3()),
    startSubscribeToNewTreaties: () => dispatch(subscribeToNewTreaties()),
    startSubscribeToNewSignatures: () => dispatch(subscribeToNewSignatures()),
    startSubscribeToRegisterAsSigner: () =>
      dispatch(subscribeToRegisterAsSigner()),
    startSubscribeToMakeActive: () => dispatch(subscribeToMakeActive()),
    startSubscribeToAllLogs: (web3) => dispatch(subscribeToAllLogs(web3)),
    startLoad3box: (address, provider) => dispatch(load3box(address, provider)),
    startLoadEthersSigner: (provider) => dispatch(loadEthersSigner(provider)),
    startLoadEthersProvider: (ethereumProvider) =>
      dispatch(loadEthersProvider(ethereumProvider)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCookies(TreatyWeb3));
