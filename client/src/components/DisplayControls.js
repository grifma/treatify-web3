import React, { Component } from "react";
import { connect } from "react-redux";
import {
  showAllTreatiesRequest,
} from "../redux/interactions";
import { Button } from "react-bootstrap";
import { showAllTreaties } from "../redux/actions";
import { ShowAllButton } from "./treatifyStyled";

const DisplayControls = ({
  dispatch,
  onShowAllPressed,
}) => {

  const loadingMessage = <div>Loading Controls</div>;
  const isLoading = false;
  const content = (
    <ShowAllButton onClick={() => onShowAllPressed()}>Show All</ShowAllButton>
  );
  return isLoading ? loadingMessage : content;
        
};

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onShowAllPressed: () => dispatch(showAllTreatiesRequest()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayControls);
