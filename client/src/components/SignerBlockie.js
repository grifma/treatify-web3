import React from "react";
import styled from "styled-components";
import Blockies from "react-blockies";
import { SignerBlockieContainer } from "./treatifyStyled";

const SignerBlockie = ({ seed }) => (
  <SignerBlockieContainer>
    <Blockies seed={seed} size={8} scale={8} />
  </SignerBlockieContainer>
);

export default SignerBlockie;
