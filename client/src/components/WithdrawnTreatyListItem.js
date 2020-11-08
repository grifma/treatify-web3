import React from "react";
import {
  TreatyItemContainer,
  ActiveButton,
  SignButton,
  RemoveButton,
  JoinButton,
} from "./treatifyStyled";

const WithdrawnTreatyListItem = ({
  treaty,
  onHidePressed,
  onMarkActivePressed,
}) => {
  const Container = treaty.isActive
    ? TreatyItemContainer
    : TreatyItemContainerWithWarning;
  return (
    <Container createdAt={treaty.createdAt}>
      <h3>{treaty.text}</h3>
      <p>
        Created at:&nbsp;
        {new Date(treaty.createdAt).toLocaleDateString()}
      </p>
      <div className="buttons-container">
        <RemoveButton onClick={() => onRemovePressed(treaty)}>
          Remove
        </RemoveButton>
      </div>
    </Container>
  );
};

export default WithdrawnTreatyListItem;
