import React from "react";
import styled from "styled-components";

export const TreatyItemContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
  background: white;
  color: black;
`;

export const TreatyItemContainerWithWarning = styled(TreatyItemContainer)`
  border-bottom: ${(props) =>
    new Date(props.createdAt) > new Date(Date.now() - 8640000 * 5)
      ? "none"
      : "2px solid black"};
`;

export const Button = styled.button`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export const ActiveButton = styled(Button)`
  display: inline-block;
  background-color: #57a657;
`;

export const RemoveButton = styled(Button)`
  display: inline-block;
  background-color: #c75757;
  margin-left: 8px;
`;

export const SignButton = styled(Button)`
  display: inline-block;
  background-color: #b9c967;
  margin-left: 8px;
`;

export const AddTextButton = styled(Button)`
  display: inline-block;
  background-color: #3cb8d9;
  margin-left: 8px;
`;

export const JoinButton = styled(Button)`
  display: inline-block;
  background-color: #3cb8d9;
  margin-left: 8px;
`;

export const ActiveTreatyInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ddd;
  border-radius: 8px;
  width: 70%;
  outline: none;
`;

export const FormContainer = styled.div`
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 8px grey;
`;

export const TreatyTextContainer = styled.div`
  display: flex;
`;

export const UnsignedText = styled.div`
  border: 1px solid black;
  flex: 0 1 50%;
  padding: 20px;
  background: white;
  color: black;
`;
export const SignedText = styled.div`
  border: 1px solid black;
  flex: 0 1 50%;
  padding: 20px;
  background: white;
  color: black;
`;

export const ItemHeader = styled.div`
  display: flex;
`;

export const ListWrapper = styled.div`
  max-width: 700px;
  margin: 50px;
  padding: 30px;
  background: 343a40;
  border-radius: 16px;
  margin-bottom: 50px;
`;
export const StatusHeader = styled.div`
  margin-top: 50px;
  color: white;
`;
