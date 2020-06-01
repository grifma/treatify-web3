import React, { useState } from "react";
import { connect } from "react-redux";
import { addTreatyRequest } from "../redux/interactions";
import { createTreaty } from "../redux/actions";
import { getTreaties } from "../redux/selectors";
import styled from "styled-components";

const FormContainer = styled.div`
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 8px grey;
  background: rgba(152, 111, 218, 0.7);
`;

const NewTreatyInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ddd;
  border-radius: 8px;
  width: 70%;
  outline: none;
`;

const NewTreatyButton = styled.button`
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

const NewTreatyForm = ({ treaties, onCreatePressed }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <FormContainer>
      <NewTreatyInput
        type="text"
        placeholder="Type your new treaty here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <NewTreatyButton
        onClick={() => {
          const isDuplicateText = treaties.some(
            (treaty) => treaty.text === inputValue
          );
          if (!isDuplicateText) {
            onCreatePressed(inputValue);
            setInputValue("");
          }
        }}
      >
        Create Treaty
      </NewTreatyButton>
    </FormContainer>
  );
};

const mapStateToProps = (state) => ({
  treaties: getTreaties(state),
});

const mapDispatchToProps = (dispatch) => ({
  onCreatePressed: (text) => dispatch(addTreatyRequest(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTreatyForm);
