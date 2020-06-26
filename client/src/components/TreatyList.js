import React, { useEffect } from "react";
import NewTreatyForm from "./NewTreatyForm";
import TreatyListItem from "./TreatyListItem";
import ActiveTreatyListItem from "./ActiveTreatyListItem";
import DraftTreatyListItem from "./DraftTreatyListItem";
import WithdrawnTreatyListItem from "./WithdrawnTreatyListItem";
import {
  loadTreaties,
  removeTreatyRequest,
  markActiveRequest,
  signTreatyRequest,
  joinTreatyRequest,
  refreshTreatyRequest,
} from "../redux/interactions";
import { connect } from "react-redux";
import { removeTreaty, markActive } from "../redux/actions";
import { displayAlert } from "../redux/interactions";
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
  withdrawnTreaties,
  web3,
  startLoadingTreaties,
  onRemovePressed,
  onMarkActivePressed,
  onDisplayAlertClicked,
  onAddTreatyTextPressed,
  onSignPressed,
  onJoinPressed,
  onRefreshTreatyPressed,
  // propTreaties,
}) => {
  useEffect(() => {
    // startLoadingTreaties();
  }, []);

  // if (draftTreaties == undefined) draftTreaties = [];
  // if (activeTreaties == undefined) activeTreaties = [];

  const loadingMessage = <div>Loading treaties</div>;
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
              onRemovePressed={onRemovePressed}
              onMarkActivePressed={onMarkActivePressed}
              onAddTreatyTextPressed={onAddTreatyTextPressed}
              onSignPressed={onSignPressed}
              onRefreshTreatyPressed={onRefreshTreatyPressed}
            />
          }
        />
        <Route
          path="/treaty/active/:id"
          children={
            <OneTreaty
              activeTreaties={activeTreaties}
              draftTreaties={draftTreaties}
              onRemovePressed={onRemovePressed}
              onMarkActivePressed={onMarkActivePressed}
              onAddTreatyTextPressed={onAddTreatyTextPressed}
              onSignPressed={onSignPressed}
              onRefreshTreatyPressed={onRefreshTreatyPressed}
            />
          }
        />
        <Route path="/hello/:text" children={<Hello />} />
        <Route path="/hellosteve" children={<HelloSteve />} />
      </Switch>
    </Router>
  );
  return isLoading ? loadingMessage : content;
};

const HelloSteve = () => {
  return <div>HELLO Steve</div>;
};

const Hello = () => {
  let { text } = useParams();
  console.log(`Hello ${text}`);
  return <div>HELLO {text}</div>;
};

const MainTreatyList = ({
  draftTreaties,
  activeTreaties,
  onRemovePressed,
  onMarkActivePressed,
  onSignPressed,
  onJoinPressed,
  onAddTreatyTextPressed,
  onRefreshTreatyPressed,
}) => {
  return (
    <ListWrapper>
      <NewTreatyForm />
      <h3 id="draft" className="h3">
        <StatusHeader>Draft Treaties:</StatusHeader>
      </h3>
      {draftTreaties.map((treaty) => (
        <DraftTreatyListItem
          key={treaty.id}
          treaty={treaty}
          onRemovePressed={onRemovePressed}
          onMarkActivePressed={onMarkActivePressed}
          onSignPressed={onSignPressed}
          onJoinPressed={onJoinPressed}
        />
      ))}
      <h3 id="active">
        <StatusHeader>Active Treaties:</StatusHeader>
      </h3>
      {activeTreaties.map((treaty) => (
        <ActiveTreatyListItem
          key={treaty.id}
          treaty={treaty}
          onRemovePressed={onRemovePressed}
          onMarkActivePressed={onMarkActivePressed}
          onAddTreatyTextPressed={onAddTreatyTextPressed}
          onSignPressed={onSignPressed}
          onRefreshTreatyPressed={onRefreshTreatyPressed}
        />
      ))}
    </ListWrapper>
  );
};

const OneTreaty = ({
  activeTreaties,
  draftTreaties,
  onRemovePressed,
  onMarkActivePressed,
  onSignPressed,
  onJoinPressed,
  onAddTreatyTextPressed,
  onRefreshTreatyPressed,
}) => {
  let { id } = useParams();
  console.log(`Render one treaty. id is ${id}`);
  let content = <div>ONETREATY</div>;
  // let content = activeTreaties
  //   .filter((treaty) => treaty.id == id)
  //   .map((selectedTreaty) => (
  //     <ActiveTreatyListItem
  //       key={treaty.id}
  //       treaty={treaty}
  //       onRemovePressed={onRemovePressed}
  //       onMarkActivePressed={onMarkActivePressed}
  //       onAddTreatyTextPressed={onAddTreatyTextPressed}
  //       onSignPressed={onSignPressed}
  //       onRefreshTreatyPressed={onRefreshTreatyPressed}
  //     />
  //   ));
  return content;
};

const mapStateToProps = (state) => ({
  isLoading: getTreatiesLoading(state),
  activeTreaties: getActiveTreaties(state),
  draftTreaties: getDraftTreaties(state),
});

const mapDispatchToProps = (dispatch) => ({
  startLoadingTreaties: () => dispatch(loadTreaties()),
  onRemovePressed: (treaty) => dispatch(removeTreatyRequest(treaty)),
  onMarkActivePressed: (treaty) => dispatch(markActiveRequest(treaty)),
  onDisplayAlertClicked: (id) => dispatch(displayAlert(id)),
  // onAddTreatyTextPressed: (id, text) => dispatch(addTreatyTextRequest(id, text)),
  onSignPressed: (treaty) => dispatch(signTreatyRequest(treaty)),
  onJoinPressed: (treaty) => dispatch(joinTreatyRequest(treaty)),
  onRefreshTreatyPressed: (treaty) => dispatch(refreshTreatyRequest(treaty)),
});

// function mapStateToProps(state) {
//   return {
//     isLoading: getTreatiesLoading(state),
//     activeTreaties: getActiveTreaties(state),
//     draftTreaties: getDraftTreaties(state),
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     startLoadingTreaties: () => dispatch(loadTreaties()),
//     onRemovePressed: (treaty) => dispatch(removeTreatyRequest(treaty.id)),
//     onMarkActivePressed: (treaty) => dispatch(markActiveRequest(treaty.id)),
//     onDisplayAlertClicked: (id) => dispatch(displayAlert(id)),
//     // onAddTreatyTextPressed: (id, text) => dispatch(addTreatyTextRequest(id, text)),
//     onSignPressed: (id) => dispatch(signTreatyRequest(id)),
//   };
// }

export default connect(mapStateToProps, mapDispatchToProps)(TreatyList);
