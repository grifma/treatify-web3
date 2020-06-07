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
  key1,
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
      <div>
        Signers:&nbsp;
        {treaty.signers.map((signer) => (
          <div>
            <Blockies seed={signer.toLowerCase()} size={10} scale={10} />
          </div>
        ))}
      </div>
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
