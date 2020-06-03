import React from "react";
import styled from "styled-components";
import AddTreatyTextForm from "./AddTreatyTextForm";

const TreatyItemContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
  background: white;
  color: black;
`;

const ActiveTreatyInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ddd;
  border-radius: 8px;
  width: 70%;
  outline: none;
`;

const TreatyItemContainerWithWarning = styled(TreatyItemContainer)`
  border-bottom: ${(props) =>
    new Date(props.createdAt) > new Date(Date.now() - 8640000 * 5)
      ? "none"
      : "2px solid gray"};
`;

const Button = styled.button`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

const ActiveButton = styled(Button)`
  display: inline-block;
  background-color: #57a657;
`;

const RemoveButton = styled(Button)`
  display: inline-block;
  background-color: #c75757;
  margin-left: 8px;
`;

const SignButton = styled(Button)`
  display: inline-block;
  background-color: #b9c967;
  margin-left: 8px;
`;

const AddTextButton = styled(Button)`
  display: inline-block;
  background-color: #3cb8d9;
  margin-left: 8px;
`;

const FormContainer = styled.div`
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 8px grey;
`;

const TreatyTextContainer = styled.div`
  display: flex;
`;

const UnsignedText = styled.div`
  border: 1px solid black;
  flex: 0 1 50%;
  padding: 20px;
  background: white;
`;
const SignedText = styled.div`
  border: 1px solid black;
  flex: 0 1 50%;
  padding: 20px;
  background: white;
`;

const ItemHeader = styled.div`
  display: flex;
`;

const IH = (
  <ItemHeader>
    <div>NaMe</div>
    <div>DaTe</div>
  </ItemHeader>
);
//old, check this is working on user-interface repo
// const IH = (
//   <ItemHeader>
//     <div>${props.name}</div>
//     <div>${props.date}</div>
//   </ItemHeader>
// )

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
        <SignButton onClick={() => onSignPressed(treaty.id)}>Sign</SignButton>
        <RemoveButton onClick={() => onRemovePressed(treaty)}>
          Remove
        </RemoveButton>
      </div>
    </Container>
  );
};

export default ActiveTreatyListItem;
