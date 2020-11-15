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
import TreatyIndexView from "./components/TreatyIndexView";
import {
  Main,
  LSide,
  RSide,
  Header,
  Footer,
  Grid,
} from "./components/treatifyStyled";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import styled from "styled-components";
import ProfileHover from "profile-hover";
import ActiveTreatyListItem from "./components/ActiveTreatyListItem";
import DisplayControls from "./components/DisplayControls";

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
}) => {
  useEffect(() => {
    async function initiate() {
      console.log('Initiate TreatyWeb3');
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
    const myWeb3 = await startLoadWeb3();
    const myAccount = await startLoadAccount(myWeb3);
    await startLoadTreatiesWeb3(myWeb3, treatyIndex);

    //3box
    startLoad3box(myAccount, window.ethereum);

    e.preventDefault();
  };

  const refresh = async (e) => {
    startLoadTreatiesWeb3(web3, treatyIndex);
    e.preventDefault();
  };

  const loadingMessage = <div>Loading Project Wallets</div>;
  const isLoading = false;
  const content = (
    <Grid>
      <Header>{/*<Nav />*/}</Header>
      <LSide>
        {account == null ? (
          <div><p>Account has not been loaded. Please ensure Metamask is connected to the correct network.</p></div>
        ) : (
          <div>
            <ProfileHover address={account} />
          </div>
        )}
        {treatyIndex == null ? (
          <div><p>Project Wallet Board has not been loaded. Please ensure Metamask is connected to the correct network.</p></div>
        ) : (
          <TreatyIndexView />
        )}
        <p></p>
      </LSide>
      <Main>
        {treatyIndex == null ? (
          <div>Project Wallet Board has not been loaded</div>
        ) : (
          <TreatyList web3={web3} />
        )}
      </Main>
      <RSide>
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
)(TreatyWeb3);
