import React, { useEffect } from "react";
import NewTreatyForm from "./NewTreatyForm";
import ActiveTreatyListItem from "./ActiveTreatyListItem";
import DraftTreatyListItem from "./DraftTreatyListItem";
import {
  loadTreatiesWeb3,
  hideTreatyRequest,
  markActiveRequest,
  signTreatyRequest,
  joinTreatyRequest,
  refreshTreatyRequest,
} from "../redux/interactions";
import { connect } from "react-redux";
import { removeTreaty, markActive } from "../redux/actions";
import {
  getTreatiesLoading,
  getActiveTreaties,
  getDraftTreaties,
  getBindingTreaties,
  getWithdrawnTreaties,
} from "../redux/selectors";
import { ListWrapper, StatusHeader } from "./treatifyStyled";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useParams,
} from "react-router-dom";

const TreatyList = ({
  isLoading,
  activeTreaties,
  draftTreaties,
  bindingTreaties,
  web3,
  startLoadingTreaties,
  onHidePressed,
  onMarkActivePressed,
  onAddTreatyTextPressed,
  onSignPressed,
  onJoinPressed,
  onRefreshTreatyPressed,
}) => {
  const loadingMessage = <div>Loading treaties</div>;
  console.log("[TreatyList] activeTreaties :>> ", activeTreaties);
  console.log("[TreatyList] draftTreaties :>> ", draftTreaties);
  const content = (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          children={
            <MainTreatyList
              activeTreaties={activeTreaties}
              draftTreaties={draftTreaties}
              onHidePressed={onHidePressed}
              onMarkActivePressed={onMarkActivePressed}
              onAddTreatyTextPressed={onAddTreatyTextPressed}
              onSignPressed={onSignPressed}
              onRefreshTreatyPressed={onRefreshTreatyPressed}
              onJoinPressed={onJoinPressed}
            />
          }
        />
        <Route
          exact
          path="/focus/:id"
          children={
            <MainTreatyList
              activeTreaties={activeTreaties}
              draftTreaties={draftTreaties}
              onHidePressed={onHidePressed}
              onMarkActivePressed={onMarkActivePressed}
              onAddTreatyTextPressed={onAddTreatyTextPressed}
              onSignPressed={onSignPressed}
              onRefreshTreatyPressed={onRefreshTreatyPressed}
              onJoinPressed={onJoinPressed}
            />
          }
        />
        <Route
          path="/id/:id"
          children={
            <OneTreaty
              activeTreaties={activeTreaties}
              draftTreaties={draftTreaties}
              onHidePressed={onHidePressed}
              onMarkActivePressed={onMarkActivePressed}
              onAddTreatyTextPressed={onAddTreatyTextPressed}
              onSignPressed={onSignPressed}
              onRefreshTreatyPressed={onRefreshTreatyPressed}
              onJoinPressed={onJoinPressed}
            />
          }
        />
      </Switch>
    </Router>
  );
  return isLoading ? loadingMessage : content;
};

function applyFocus(elementList, focusId) {
  console.log("applyFocus called with element list :>> ", elementList);
  console.log("applyFocus called with focusId :>> ", focusId);
  if (focusId == undefined) return elementList;
  let focusedElementList = elementList.map((x) => {
    if (x.id == focusId) {
      return {
        ...x,
        inFocus: true,
      };
    } else {
      return {
        ...x,
        inFocus: false,
      };
    }
  });
  console.log("focusedElementList :>> ", focusedElementList);
  return focusedElementList;
}

const MainTreatyList = ({
  draftTreaties,
  activeTreaties,
  onHidePressed,
  onMarkActivePressed,
  onSignPressed,
  onJoinPressed,
  onAddTreatyTextPressed,
  onRefreshTreatyPressed,
}) => {
  let { id } = useParams();
  console.log(`Focus id is ${id}`);
  return (
    <ListWrapper>
      <NewTreatyForm />
      <h3 id="draft" className="h3">
        <StatusHeader>Draft Project Wallets:</StatusHeader>
      </h3>
      {applyFocus(draftTreaties, id).map((treaty) => (
        <DraftTreatyListItem
          key={treaty.id}
          treaty={treaty}
          onHidePressed={onHidePressed}
          onMarkActivePressed={onMarkActivePressed}
          onSignPressed={onSignPressed}
          onJoinPressed={onJoinPressed}
        />
      ))}
      <h3 id="active">
        <StatusHeader>Active Project Wallets:</StatusHeader>
      </h3>
      {applyFocus(activeTreaties, id).map((treaty) => (
        <ActiveTreatyListItem
          key={treaty.id}
          treaty={treaty}
          onHidePressed={onHidePressed}
          onMarkActivePressed={onMarkActivePressed}
          onAddTreatyTextPressed={onAddTreatyTextPressed}
          onSignPressed={onSignPressed}
          onRefreshTreatyPressed={onRefreshTreatyPressed}
          onHidePressed={onHidePressed}
        />
      ))}
    </ListWrapper>
  );
};

const OneTreaty = ({
  activeTreaties,
  draftTreaties,
  onHidePressed,
  onMarkActivePressed,
  onSignPressed,
  onJoinPressed,
  onAddTreatyTextPressed,
  onRefreshTreatyPressed,
}) => {
  let { id } = useParams();
  console.log(`Render one treaty. id is ${id}`);
  // let content = <div>ONETREATY</div>;
  console.log("activeTreaties :>> ", activeTreaties);
  let selectedTreaty = activeTreaties.filter((treaty) => treaty.id == id);
  console.log(`id: ${id}`, selectedTreaty);
  let selectedContent = (
    <ActiveTreatyListItem
      key={selectedTreaty.id}
      treaty={selectedTreaty}
      onHidePressed={onHidePressed}
      onMarkActivePressed={onMarkActivePressed}
      onAddTreatyTextPressed={onAddTreatyTextPressed}
      onSignPressed={onSignPressed}
      onRefreshTreatyPressed={onRefreshTreatyPressed}
      onHidePressed={onHidePressed}
    />
  );
  return selectedContent;
};

const mapStateToProps = (state, ownProps) => ({
  isLoading: getTreatiesLoading(state),
  activeTreaties: getActiveTreaties(state),
  draftTreaties: getDraftTreaties(state),
});

const mapDispatchToProps = (dispatch) => ({
  startLoadingTreaties: () => dispatch(loadTreatiesWeb3()),
  onHidePressed: (id) => dispatch(hideTreatyRequest(id)),
  onMarkActivePressed: (treaty) => dispatch(markActiveRequest(treaty)),
  onSignPressed: (treaty) => dispatch(signTreatyRequest(treaty)),
  onJoinPressed: (treaty) => dispatch(joinTreatyRequest(treaty)),
  onRefreshTreatyPressed: (treaty) => dispatch(refreshTreatyRequest(treaty)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TreatyList);
