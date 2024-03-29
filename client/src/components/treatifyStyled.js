import React from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import styled from "styled-components";

export const TreatyItemContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
  background: white;
  color: black;
  overflow: visible;
  padding: 10px;
`;

export const FocusedTreatyItemContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
  color: black;
  overflow: hidden;
  padding: 10px;
`;
export const UnfocusedTreatyItemContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
  color: black;
  overflow: hidden;
  padding: 10px;
`;

export const ShadowOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
  color: black;
  overflow: hidden;
  padding: 10px;
  z-index: 2;
`;

// export const UnfocusedTreatyItemContainer = styled.div`
//   background-color: rgba(0, 0, 0, 0.5);
//   border-radius: 8px;
//   margin-top: 8px;
//   padding: 16px;
//   position: relative;
//   box-shadow: 0 4px 8px grey;
//   color: black;
//   overflow: hidden;
//   padding: 10px;
//   z-index: 2;
// `;

export const TreatyItemContainerWithWarning = styled(TreatyItemContainer)`
  border-bottom: ${(props) =>
    new Date(props.createdAt) > new Date(Date.now() - 8640000 * 5)
      ? "none"
      : "2px solid black"};
`;

export const Button = styled.button`
  font-size: 16px;
  padding: 8px;
  margin: 2px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export const ActiveButton = styled(Button)`
  display: inline-block;
  // background-color: #57a657;
`;

export const ActivePrivateButton = styled(Button)`
  display: inline-block;
  // background-color: #57a657;
`;

export const RemoveButton = styled(Button)`
  display: inline-block;
  // background-color: #c75757;
  margin-left: 8px;
`;

export const HideButton = styled(Button)`
  display: inline-block;
  // background-color: #c75757;
  margin-left: 8px;
`;

export const ShowAllButton = styled(Button)`
  display: inline-block;
  // background-color: #c75757;
  margin-left: 8px;
`;

export const SignButton = styled(Button)`
  display: inline-block;
  // background-color: #b9c967;
  margin-left: 8px;
`;

export const AddTextButton = styled(Button)`
  display: inline-block;
  // background-color: #3cb8d9;
  margin-left: 8px;
`;

export const JoinButton = styled(Button)`
  display: inline-block;
  // background-color: #3cb8d9;
  margin-left: 8px;
`;

export const RefreshTreatyButton = styled(Button)`
  display: inline-block;
  // background-color: #0df2c8;
  margin-left: 8px;
`;

export const ShowBoardButton = styled.input`
  font-size: 16px;
  color: white;
`;

export const ActiveTreatyInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ddd;
  border-radius: 8px;
  width: 70%;
  outline: none;
`;

export const FormContainer = styled.div`
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 8px grey;
`;

export const TreatyTextContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const UnsignedText = styled.div`
  border: 1px solid black;
  flex: 1 0 150px;
  padding: 10px;
  color: black;
`;
export const SignedText = styled.div`
  border: 1px solid black;
  flex: 1 0 150px;
  padding: 10px;
  color: black;
`;

export const ItemHeader = styled.div`
  display: flex;
`;

export const ListWrapper = styled.div`
  max-width: 700px;
  margin: 10px;
  padding: 20px;
  background: 343a40;
  border-radius: 16px;
  margin-bottom: 50px;
`;
export const StatusHeader = styled.div`
  margin-top: 50px;
  color: white;
`;

export const AddTreatyTextFormContainer = styled.div`
  border-radius: 8px;
  padding: 4px;
  text-align: center;
  box-shadow: 0 1px 1px grey;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
`;

export const AddTreatyInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ddd;
  border-radius: 8px;
  width: 70%;
  outline: none;
  flex: 1 1 auto;
`;

export const AddTreatyTextButton = styled.button`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  margin-left: 8px;
  width: 20%;
  // background-color: #9c65cc;
  flex: 1 0 60px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  @media only screen and (min-width: 769px) {
    grid-template-rows: 104px 400px 40px;
  }
  @media only screen and (max-width: 768px) {
  }
`;

export const GridItem = styled.div`
  color: white;
  overflow: visible;
`;

export const Header = styled(GridItem)`
  @media only screen and (min-width: 769px) {
    grid-column: span 12;
  }
  @media only screen and (max-width: 768px) {
    order: 1;
    grid-column: span 12;
  }
`;

export const LSide = styled(GridItem)`
  display: flex;
  flex-flow: column;
  padding: 10px;
  @media only screen and (min-width: 769px) {
    grid-column: span 2;
    overflow: visible;
  }
  @media only screen and (max-width: 768px) {
    grid-column: span 12;
    order: 3;
  }
`;

export const Main = styled(GridItem)`
  @media only screen and (min-width: 769px) {
    grid-column: span 8;
  }
  @media only screen and (max-width: 768px) {
    grid-column: span 12;
    order: 2;
  }
`;

export const RSide = styled(GridItem)`
  padding: 10px;
  @media only screen and (min-width: 769px) {
    grid-column: span 2;
  }
  @media only screen and (max-width: 768px) {
    grid-column: span 12;
    order: 4;
  }
`;

export const Footer = styled(GridItem)`
  grid-column: span 12;
  order: 5;
`;

export const SignerBlockieSetContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px;
  padding: 12px;
`;

export const UnsignedSignerBlockieContainer = styled.div`
  padding: 2px;
  display: flex;
`;
export const SignedSignerBlockieContainer = styled.div`
  padding: 2px;
  background: hsl(115, 98%, 80%);
  display: flex;
`;
export const BrokenSignerBlockieContainer = styled.div`
  padding: 2px;
  background: hsl(1, 94%, 51%);
  display: flex;
`;
export const WithdrawnSignerBlockieContainer = styled.div`
  padding: 2px;
  background: #e46967;
  display: flex;
`;

export const StyledPopover = styled(Popover)`
  min-width: 450px;
  background: #343a40;
  color: white;
  padding: 16px;
`;

export const StyledPopoverTitle = styled(Popover.Title)`
  min-width: 450px;
  background: #343a40;
  color: white;
  padding: 16px;
`;

export const TreatyListItemCommonHeaderContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-content: space-between;
  height: 22px;
  padding: 22px;
  font-size: 22px;
  font-weight: bold;
`;

export const SignatureWhitespace = styled.div`
  display: flex;
  height: 40px;
`

export const HeaderDate = styled.div`
  margin: 8px;
  color: gray;
`