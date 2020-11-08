import React from "react";
import { OverlayTrigger } from "react-bootstrap";
import { SignerBlockieSetContainer } from "./treatifyStyled";
import SignerBlockie from "./SignerBlockie";

const TreatyListItemCommonSignatures = ({ treaty }) => {
  return (
    <div>
      <SignerBlockieSetContainer>
        Signers:&nbsp;
        {treaty.signers.map((signer, i) => (
          <div>
            <SignerBlockie
              address={signer}
              signatureState={treaty.signatureState[i]}
            />
          </div>
        ))}
      </SignerBlockieSetContainer>
    </div>
  );
};

export default TreatyListItemCommonSignatures;
