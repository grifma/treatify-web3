import React from "react";
import {
  TreatyItemContainer,
  TreatyItemContainerWithWarning,
  ActiveButton,
  SignButton,
  RemoveButton,
  JoinButton,
  RefreshTreatyButton,
  TreatyTextContainer,
  SignedText,
  UnsignedText,
  SignerBlockieSetContainer,
  StyledPopover,
  StyledPopoverTitle,
} from "./treatifyStyled";
import AddTreatyTextForm from "./AddTreatyTextForm";
import SignerBlockie from "./SignerBlockie";
import { OverlayTrigger } from "react-bootstrap";

const ActiveTreatyListItem = ({
  treaty,
  onRemovePressed,
  onMarkActivePressed,
  onAddTreatyTextPressed,
  onSignPressed,
  onRefreshTreatyPressed,
}) => {
  const Container = treaty.isActive
    ? TreatyItemContainer
    : TreatyItemContainerWithWarning;
  return (
    <Container createdAt={treaty.createdAt}>
      {/* <IH name={treaty.text} date={treaty.date} /> */}
      <h3>
        #{treaty.id}&nbsp;
        {treaty.text}
      </h3>
      <p>
        Created at:&nbsp;
        {new Date(treaty.createdAt * 1000).toLocaleDateString()}
      </p>
      <p>
        Lives at:&nbsp;
        {treaty.address}
      </p>
      <SignerBlockieSetContainer>
        Signers:&nbsp;
        {treaty.signers.map((signer) => (
          <div>
            <SignerBlockie address={signer} />
          </div>
        ))}
      </SignerBlockieSetContainer>
      <TreatyTextContainer>
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="right"
          delay={{ show: 250, hide: 700 }}
          overlay={developerInfoPopover(treaty)}
        >
          <UnsignedText>
            {treaty.unsignedTreatyText.length === 0 ? null : <h3>Unsigned</h3>}
            {treaty.unsignedTreatyText.length > 0 &&
              treaty.unsignedTreatyText.map((text) => <p>{text}</p>)}
          </UnsignedText>
        </OverlayTrigger>
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="right"
          delay={{ show: 250, hide: 700 }}
          overlay={developerInfoPopover(treaty)}
        >
          <SignedText>
            {treaty.signedTreatyText.length === 0 ? null : <h3>Signed</h3>}
            {treaty.signedTreatyText.length > 0 &&
              treaty.signedTreatyText.map((text) => <p>{text}</p>)}
          </SignedText>
        </OverlayTrigger>
      </TreatyTextContainer>
      <AddTreatyTextForm
        treaty={treaty}
        onAddTreatyTextPressed={onAddTreatyTextPressed}
      />
      <div className="buttons-container">
        <SignButton onClick={() => onSignPressed(treaty)}>Sign</SignButton>
        <RemoveButton onClick={() => onRemovePressed(treaty)}>
          Remove
        </RemoveButton>
        <RefreshTreatyButton onClick={() => onRefreshTreatyPressed(treaty)}>
          Refresh
        </RefreshTreatyButton>
      </div>
    </Container>
  );
};

const developerInfoPopover = (treaty) => (
  <StyledPopover id={`unsignedtext-popover-${treaty.id}`}>
    <StyledPopoverTitle as="h3">Developer Info:</StyledPopoverTitle>
    <StyledPopover.Content>
      <div id={`developer-info-${treaty.id}`} class="onDark">
        {treaty.developerInfo}
        {/* {treaty.developerInfo.map((x) => x)} */}
      </div>
    </StyledPopover.Content>
  </StyledPopover>
);

export default ActiveTreatyListItem;
