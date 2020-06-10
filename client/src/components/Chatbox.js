import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
// import { Main, LSide, RSide, Header, Footer, Grid } from "./treatifyStyled";
import styled from "styled-components";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  @media only screen and (min-width: 769px) {
    grid-template-rows: 100px 400px 100px;
  }
  @media only screen and (max-width: 768px) {
  }
`;

export const GridItem = styled.div`
  color: white;
`;

export const Header = styled(GridItem)`
  @media only screen and (min-width: 769px) {
    grid-column: span 12;
  }
  @media only screen and (max-width: 768px) {
    order: 1;
    grid-column: span 12;
  }
`;

export const LSide = styled(GridItem)`
  @media only screen and (min-width: 769px) {
    grid-column: span 2;
    overflow: hidden;
  }
  @media only screen and (max-width: 768px) {
    grid-column: span 12;
    order: 3;
  }
`;

export const Main = styled(GridItem)`
  @media only screen and (min-width: 769px) {
    grid-column: span 8;
  }
  @media only screen and (max-width: 768px) {
    grid-column: span 12;
    order: 2;
  }
`;

export const RSide = styled(GridItem)`
  @media only screen and (min-width: 769px) {
    grid-column: span 2;
  }
  @media only screen and (max-width: 768px) {
    grid-column: span 12;
    order: 4;
  }
`;

export const Footer = styled(GridItem)`
  grid-column: span 12;
  order: 5;
`;

const Chatbox = ({ box, space, title }) => {
  useEffect(() => {
    async function initiate() {}
    initiate();
  }, []);

  const connectChatbox = async (e) => {
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
  const loadingMessage = <div>Loading chat component</div>;
  const isLoading = false;
  const content = <div></div>;
  return isLoading ? loadingMessage : content;
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Chatbox);
