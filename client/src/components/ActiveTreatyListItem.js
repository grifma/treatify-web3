import React from "react";
import {
  TreatyItemContainer,
  TreatyItemContainerWithWarning,
  ActiveButton,
  SignButton,
  RemoveButton,
  JoinButton,
  TreatyTextContainer,
  SignedText,
  UnsignedText,
} from "./treatifyStyled";
import AddTreatyTextForm from "./AddTreatyTextForm";
import Blockies from "react-blockies";

const ActiveTreatyListItem = ({
  treaty,
  onRemovePressed,
  onMarkActivePressed,
  onAddTreatyTextPressed,
  onSignPressed,
}) => {
  const Container = treaty.isActive
    ? TreatyItemContainer
    : TreatyItemContainerWithWarning;
  return (
    <Container createdAt={treaty.createdAt}>
      {/* <IH name={treaty.text} date={treaty.date} /> */}
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
      <TreatyTextContainer>
        <UnsignedText>
          {console.log(treaty.unsignedTreatyText)}
          {treaty.unsignedTreatyText.length === 0 ? null : <h3>Unsigned</h3>}
          {treaty.unsignedTreatyText.map((text) => (
            <p>{text}</p>
          ))}
        </UnsignedText>
        <SignedText>
          {treaty.signedTreatyText.length === 0 ? null : <h3>Signed</h3>}
          {treaty.signedTreatyText.map((text) => (
            <p>{text}</p>
          ))}
        </SignedText>
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
      </div>
    </Container>
  );
};

export default ActiveTreatyListItem;
