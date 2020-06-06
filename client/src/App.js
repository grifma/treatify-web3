import React from "react";
import { hot } from "react-hot-loader";
import TreatyWeb3 from "./TreatyWeb3";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => <TreatyWeb3 />;

export default hot(module)(App);
