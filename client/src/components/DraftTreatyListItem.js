import React from "react";
import {
  TreatyItemContainer,
  TreatyItemContainerWithWarning,
  ActiveButton,
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
          Make Active
        </ActiveButton>
        <JoinButton onClick={() => onJoinPressed(treaty)}>Join</JoinButton>
        <HideButton onClick={() => onHidePressed(treaty)}>Hide</HideButton>
      </div>
    </Container>
  );
};

export default DraftTreatyListItem;
