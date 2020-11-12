import React from "react";
import {
  TreatyItemContainer,
  TreatyItemContainerWithWarning,
  ActiveButton,
  ActivePrivateButton,
  SignButton,
  HideButton,
  JoinButton,
} from "./treatifyStyled";
import TreatyListItemCommonHeader from "./TreatyListItemCommonHeader";
import TreatyListItemCommonSignatures from "./TreatyListItemCommonSignatures";

const DraftTreatyListItem = ({
  treaty,
  onHidePressed,
  onMarkActivePressed,
  onMarkActivePrivatePressed,
  onJoinPressed,
}) => {
  const Container = treaty.isActive
    ? TreatyItemContainer
    : TreatyItemContainerWithWarning;
  return (
    <Container key={treaty.id} createdAt={treaty.createdAt}>
      <TreatyListItemCommonHeader treaty={treaty} />
      <TreatyListItemCommonSignatures treaty={treaty} />
      <div className="buttons-container">
        <ActiveButton onClick={() => onMarkActivePressed(treaty)}>
          Public
        </ActiveButton>
        <ActivePrivateButton onClick={() => onMarkActivePrivatePressed(treaty)}>
          Confidential
        </ActivePrivateButton>
        <JoinButton onClick={() => onJoinPressed(treaty)}>Join</JoinButton>
        <HideButton onClick={() => onHidePressed(treaty.id)}>Hide</HideButton>
      </div>
    </Container>
  );
};

export default DraftTreatyListItem;
