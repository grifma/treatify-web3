import React from "react";
import { OverlayTrigger } from "react-bootstrap";
import { TreatyListItemCommonHeaderContainer } from "./treatifyStyled";

const TreatyListItemCommonHeader = ({ treaty }) => {
  return (
    <TreatyListItemCommonHeaderContainer>
      <div>
        <a href={"/focus/" + treaty.id}>
          #{treaty.id}&nbsp;
          {treaty.text}
        </a>
      </div>
      <div>{new Date(treaty.createdAt * 1000).toLocaleDateString()}</div>
    </TreatyListItemCommonHeaderContainer>
  );
};

export default TreatyListItemCommonHeader;
