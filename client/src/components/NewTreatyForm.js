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
  background: white;
  margin-bottom: 50px;
  //   background: rgba(152, 111, 218, 0.7);
  display: flex;
  flex-wrap: wrap;
`;

const NewTreatyInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ddd;
  border-radius: 8px;
  width: 70%;
  outline: none;
  flex: 1 1 auto;
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
  flex: 1 0 63px;
`;
const StatusHeader = styled.div`
  color: white;
`;

const NewTreatyForm = ({ treaties, onCreatePressed }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <h3>
        <StatusHeader>Add New Treaty</StatusHeader>
      </h3>
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  treaties: getTreaties(state),
});

const mapDispatchToProps = (dispatch) => ({
  onCreatePressed: (text) => dispatch(addTreatyRequest(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTreatyForm);
