import React from "react";
import {
  TreatyItemContainer,
  TreatyItemContainerWithWarning,
  ActiveButton,
  SignButton,
  RemoveButton,
  JoinButton,
  SignerBlockieSetContainer,
} from "./treatifyStyled";
import SignerBlockie from "./SignerBlockie";

const DraftTreatyListItem = ({
  treaty,
  onRemovePressed,
  onMarkActivePressed,
  onJoinPressed,
}) => {
  const Container = treaty.isActive
    ? TreatyItemContainer
    : TreatyItemContainerWithWarning;
  return (
    <Container createdAt={treaty.createdAt}>
      <h3>{treaty.text}</h3>
      <div>
        Created at:&nbsp;
        {new Date(treaty.createdAt * 1000).toLocaleDateString()}
      </div>
      <div>
        Lives at:&nbsp;
        {treaty.address}
      </div>
      <SignerBlockieSetContainer>
        Signers:&nbsp;
        {treaty.signers.map((signer) => (
          <div>
            <SignerBlockie address={signer} />
          </div>
        ))}
      </SignerBlockieSetContainer>
      <div className="buttons-container">
        <ActiveButton onClick={() => onMarkActivePressed(treaty)}>
          Make Active
        </ActiveButton>
        <JoinButton onClick={() => onJoinPressed(treaty)}>Join</JoinButton>
        <RemoveButton onClick={() => onRemovePressed(treaty)}>
          Remove
        </RemoveButton>
      </div>
    </Container>
  );
};

export default DraftTreatyListItem;
