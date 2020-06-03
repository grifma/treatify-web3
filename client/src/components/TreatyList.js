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
import styled from "styled-components";

const ListWrapper = styled.div`
  max-width: 700px;
  margin: 50px;
  padding: 30px;
  background: 343a40;
  border-radius: 16px;
  margin-bottom: 50px;
`;
const StatusHeader = styled.div`
  margin-top: 50px;
  color: white;
`;

const TreatyList = ({
  activeTreaties,
  draftTreaties,
  bindingTreaties,
  withdrawnTreaties,
  isLoading,
  onRemovePressed,
  onMarkActivePressed,
  onDisplayAlertClicked,
  startLoadingTreaties,
  onAddTreatyTextPressed,
  onSignPressed,
}) => {
  useEffect(() => {
    // startLoadingTreaties();
  }, []);

  // if (draftTreaties == undefined) draftTreaties = [];
  // if (activeTreaties == undefined) activeTreaties = [];

  const loadingMessage = <div>Loading treaties</div>;
  const content = (
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
        />
      ))}
    </ListWrapper>
  );
  return isLoading ? loadingMessage : content;
};

const mapStateToProps = (state) => ({
  isLoading: getTreatiesLoading(state),
  activeTreaties: getActiveTreaties(state),
  draftTreaties: getDraftTreaties(state),
});

const mapDispatchToProps = (dispatch) => ({
  startLoadingTreaties: () => dispatch(loadTreaties()),
  onRemovePressed: (treaty) => dispatch(removeTreatyRequest(treaty.id)),
  onMarkActivePressed: (treaty) => dispatch(markActiveRequest(treaty.id)),
  onDisplayAlertClicked: (id) => dispatch(displayAlert(id)),
  // onAddTreatyTextPressed: (id, text) => dispatch(addTreatyTextRequest(id, text)),
  onSignPressed: (id) => dispatch(signTreatyRequest(id)),
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
