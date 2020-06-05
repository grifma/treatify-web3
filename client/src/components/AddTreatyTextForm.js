import React, { useState } from "react";
import { connect } from "react-redux";
import { addTreatyRequest } from "../redux/interactions";
import { addTreatyTextRequest } from "../redux/interactions";
import { addTextToTreaty } from "../redux/actions";
import { getTreaties } from "../redux/selectors";
import {
  AddTreatyTextFormContainer,
  AddTreatyInput,
  AddTreatyTextButton,
} from "./treatifyStyled";

const AddTreatyTextForm = ({ treaty, onAddTreatyTextPressed }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <AddTreatyTextFormContainer>
      <AddTreatyInput
        type="text"
        placeholder="Add text here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <AddTreatyTextButton
        onClick={() => {
          onAddTreatyTextPressed(treaty, inputValue);
          setInputValue("");
        }}
      >
        Add Treaty Text
      </AddTreatyTextButton>
    </AddTreatyTextFormContainer>
  );
};

const mapStateToProps = (state) => ({
  treaties: getTreaties(state),
});

const mapDispatchToProps = (dispatch) => ({
  onCreatePressed: (text) => dispatch(addTreatyRequest(text)),
  onAddTreatyTextPressed: (treaty, text) =>
    dispatch(addTreatyTextRequest(treaty, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTreatyTextForm);
