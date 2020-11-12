import React from "react";
import { OverlayTrigger } from "react-bootstrap";
import { SignerBlockieSetContainer, SignatureWhitespace } from "./treatifyStyled";
import SignerBlockie from "./SignerBlockie";

const TreatyListItemCommonSignatures = ({ treaty }) => {
  return (
    <div>
      <SignerBlockieSetContainer>
        Signers:&nbsp;
        {treaty.signers.map((signer, i) => (
          <div key={i}>
            <SignerBlockie
              address={signer}
              signatureState={treaty.signatureState[i]}
            />
          </div>
        ))}
        {(treaty.numSigners == 0) && (<SignatureWhitespace />)}
        <p></p>
      </SignerBlockieSetContainer>
    </div>
  );
};

export default TreatyListItemCommonSignatures;
