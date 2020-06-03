import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import configureStore from "./redux/configure";
import * as serviceWorker from "./serviceWorker";
import AppHotContainer from "./AppHotContainer";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AppHotContainer />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
