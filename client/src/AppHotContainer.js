import React from "react";
import { hot } from "react-hot-loader";
// import App from "./App";
import TreatyWeb3 from "./TreatyWeb3";
import styled from "styled-components";
import TreatyList from "./components/TreatyList";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

const AppContainer = styled.div`
  margin: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  color: #222222;
  width: 100vw;
  height: 100vh;
`;

const AppHotContainer = () => (
  <Router>
    <AppContainer>
      <TreatyWeb3 />
      <ErrorBoundary>{null /* <TreatyList /> */}</ErrorBoundary>
      <Switch>
        <Route
          exact
          path="/treatify"
          render={(props) => {
            //  let x = "whatever"
            return <TreatyList props={props} />;
          }}
        />
        <Route
          path="/hello"
          render={(props) => {
            return (
              <div>
                <h1>Hello</h1>
              </div>
            );
          }}
        />
      </Switch>
    </AppContainer>
  </Router>
);

export default hot(module)(AppHotContainer);
