import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const loggerMiddleware = createLogger();
const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preLoadedState) {
  return createStore(
    rootReducer,
    preLoadedState,
    composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
  );
}
