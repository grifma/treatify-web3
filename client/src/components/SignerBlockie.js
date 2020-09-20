import React from "react";
import styled from "styled-components";
import Blockies from "react-blockies";
import {
  UnsignedSignerBlockieContainer,
  SignedSignerBlockieContainer,
  BrokenSignerBlockieContainer,
  WithdrawnSignerBlockieContainer,
} from "./treatifyStyled";
import ProfileHover from "profile-hover";

const SignerBlockie = ({ address, signatureState }) => {
  console.log("signatureState :>> ", signatureState);
  if (
    signatureState == undefined ||
    signatureState == "Unsigned" ||
    signatureState == "NotRegistered"
  ) {
    return (
      <UnsignedSignerBlockieContainer>
        <StyledProfileHover
          address={address}
          tileStyle={false}
          orientation={"bottom"}
        />
      </UnsignedSignerBlockieContainer>
    );
  }
  if (signatureState == "Signed") {
    return (
      <SignedSignerBlockieContainer>
        <StyledProfileHover
          address={address}
          tileStyle={false}
          orientation={"bottom"}
        />
      </SignedSignerBlockieContainer>
    );
  }
  if (signatureState == "Broken") {
    return (
      <BrokenSignerBlockieContainer>
        <StyledProfileHover
          address={address}
          tileStyle={false}
          orientation={"bottom"}
        />
      </BrokenSignerBlockieContainer>
    );
  }
  if (signatureState == "Withdrawn") {
    return (
      <WithdrawnSignerBlockieContainer>
        <StyledProfileHover
          address={address}
          tileStyle={false}
          orientation={"bottom"}
        />
      </WithdrawnSignerBlockieContainer>
    );
  }
};

const StyledProfileHover = styled(ProfileHover)``;

export default SignerBlockie;
