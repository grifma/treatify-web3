import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
// import { persistReducer } from "redux-persist";
// import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
// import thunk from "redux-thunk";
// import storage from "redux-persist/lib/storage";

const loggerMiddleware = createLogger();
const middleware = [
  // thunk
];

// const persistConfig = {
//   key: "root",
//   storage,
//   stateReconciler: autoMergeLevel2,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

//connects redux browser to app
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preLoadedState) {
  return createStore(
    rootReducer,
    // persistedReducer,
    preLoadedState,
    composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
  );
}
