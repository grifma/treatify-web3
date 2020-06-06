import React from "react";
import {
  TreatyItemContainer,
  TreatyItemContainerWithWarning,
  ActiveButton,
  SignButton,
  RemoveButton,
  JoinButton,
} from "./treatifyStyled";
import Blockies from "react-blockies";

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
      <p>
        Created at:&nbsp;
        {new Date(treaty.createdAt * 1000).toLocaleDateString()}
      </p>
      <p>
        Lives at:&nbsp;
        {treaty.address}
      </p>
      <p>
        Signers:&nbsp;
        {treaty.signers.map((signer) => (
          <div>
            <Blockies seed={signer.toLowerCase()} size={10} scale={10} />
          </div>
        ))}
      </p>
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
