import React from "react";
import styled from "styled-components";
import {
  TreatyItemContainer,
  ActiveButton,
  SignButton,
  RemoveButton,
} from "./treatifyStyled";

const TreatyListItem = ({
  treaty,
  onRemovePressed,
  onMarkActivePressed,
  onSignPressed,
  onJoinPressed,
}) => {
  const Container = treaty.isActive
    ? treatifyStyled.TreatyItemContainer
    : treatifyStyled.TreatyItemContainerWithWarning;
  return (
    <Container createdAt={treaty.createdAt}>
      <h3>{treaty.text}</h3>
      <p>
        Created at:&nbsp;
        {new Date(treaty.createdAt).toLocaleDateString()}
      </p>
      <div className="buttons-container">
        {treaty.status == "Draft" ? (
          <ActiveButton onClick={() => onMarkActivePressed(treaty)}>
            Mark As Active
          </ActiveButton>
        ) : null}
        {treaty.status == "Active" ? (
          <SignButton onClick={() => onSignPressed(treaty)}>Sign</SignButton>
        ) : null}
        <RemoveButton onClick={() => onRemovePressed(treaty)}>
          Remove
        </RemoveButton>
      </div>
    </Container>
  );
};

export default TreatyListItem;
