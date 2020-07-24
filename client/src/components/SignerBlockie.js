import React from "react";
import styled from "styled-components";
import Blockies from "react-blockies";
import { SignerBlockieContainer } from "./treatifyStyled";
import ProfileHover from "profile-hover";

const SignerBlockie = ({ address }) => (
  <SignerBlockieContainer>
    <StyledProfileHover
      address={address}
      tileStyle={false}
      orientation={"bottom"}
    />
  </SignerBlockieContainer>
);

const StyledProfileHover = styled(ProfileHover)``;

export default SignerBlockie;
