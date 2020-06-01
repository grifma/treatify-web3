import React, { useState } from "react";
import { connect } from "react-redux";
import { addTreatyRequest } from "../redux/interactions";
import { addTreatyTextRequest } from "../redux/interactions";
import { addTextToTreaty } from "../redux/actions";
import { getTreaties } from "../redux/selectors";
import styled from "styled-components";

const FormContainer = styled.div`
  border-radius: 8px;
  padding: 4px;
  text-align: center;
  box-shadow: 0 1px 1px grey;
  margin: 10px;
`;

const AddTreatyInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ddd;
  border-radius: 8px;
  width: 70%;
  outline: none;
`;

const AddTreatyTextButton = styled.button`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  margin-left: 8px;
  width: 20%;
  background-color: #9c65cc;
`;

const AddTreatyTextForm = ({ treaty, onAddTreatyTextPressed }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <FormContainer>
      <AddTreatyInput
        type="text"
        placeholder="Add text here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <AddTreatyTextButton
        onClick={() => {
          onAddTreatyTextPressed(treaty.id, inputValue);
          setInputValue("");
        }}
      >
        Add Treaty Text
      </AddTreatyTextButton>
    </FormContainer>
  );
};

const mapStateToProps = (state) => ({
  treaties: getTreaties(state),
});

const mapDispatchToProps = (dispatch) => ({
  onCreatePressed: (text) => dispatch(addTreatyRequest(text)),
  onAddTreatyTextPressed: (id, text) =>
    dispatch(addTreatyTextRequest(id, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTreatyTextForm);
