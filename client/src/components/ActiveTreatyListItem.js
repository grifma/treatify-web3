import React from "react";
import {
  FocusedTreatyItemContainer,
  UnfocusedTreatyItemContainer,
  ActiveButton,
  SignButton,
  HideButton,
  JoinButton,
  RefreshTreatyButton,
  TreatyTextContainer,
  SignedText,
  UnsignedText,
  StyledPopover,
  StyledPopoverTitle,
} from "./treatifyStyled";
import AddTreatyTextForm from "./AddTreatyTextForm";
import TreatyListItemCommonHeader from "./TreatyListItemCommonHeader";
import TreatyListItemCommonSignatures from "./TreatyListItemCommonSignatures";
import { OverlayTrigger } from "react-bootstrap";

const ActiveTreatyListItem = ({
  treaty,
  onHidePressed,
  onMarkActivePressed,
  onAddTreatyTextPressed,
  onSignPressed,
  onRefreshTreatyPressed,
}) => {
  const Container = treaty.inFocus
    ? FocusedTreatyItemContainer
    : UnfocusedTreatyItemContainer;
  if (treaty.hidden) return null;
  return (
    <Container key={`c${treaty.key}`} createdAt={treaty.createdAt}>
      <TreatyListItemCommonHeader key={`h${treaty.key}`} treaty={treaty} />
      <TreatyListItemCommonSignatures key={`s${treaty.key}`} treaty={treaty} />
      <TreatyTextContainer>
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="right"
          delay={{ show: 250, hide: 700 }}
          overlay={infoPopover(treaty)}
        >
        <UnsignedText>
          <h3>Unsigned</h3>
          {treaty.unsignedTreatyText.length > 0 &&
            treaty.unsignedTreatyText.map((text, i) => <p key={i}>{text}</p>)}
        </UnsignedText>
        </OverlayTrigger>
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="right"
          delay={{ show: 250, hide: 700 }}
          overlay={infoPopover(treaty)}
        >
        <SignedText>
          <h3>Signed</h3>
          {treaty.signedTreatyText.length > 0 &&
            treaty.signedTreatyText.map((text, i) => <p key={i}>{text}</p>)}
        </SignedText>
        </OverlayTrigger>
      </TreatyTextContainer>
      <AddTreatyTextForm
        treaty={treaty}
        onAddTreatyTextPressed={onAddTreatyTextPressed}
      />
      <div className="buttons-container">
        <SignButton onClick={() => onSignPressed(treaty)}>Sign</SignButton>
        <HideButton onClick={() => onHidePressed(treaty.id)}>Hide</HideButton>
      </div>
    </Container>
  );
};

const developerInfoPopover = (treaty) => (
  <StyledPopover id={`unsignedtext-popover-${treaty.id}`}>
    <StyledPopoverTitle as="h3">Developer Info:</StyledPopoverTitle>
    <StyledPopover.Content>
      <div id={`developer-info-${treaty.id}`} className="onDark">
        {treaty.developerInfo}
      </div>
    </StyledPopover.Content>
  </StyledPopover>
);

const infoPopover = (treaty) => (
  <StyledPopover id={`unsignedtext-popover-${treaty.id}`}>
    <StyledPopoverTitle as="h3">Info:</StyledPopoverTitle>
    <StyledPopover.Content>
      <div id={`info-${treaty.id}`} className="onDark">
        {treaty.developerInfo}
      </div>
    </StyledPopover.Content>
  </StyledPopover>
);

export default ActiveTreatyListItem;
