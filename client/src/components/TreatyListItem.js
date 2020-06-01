import React from 'react';
import styled from 'styled-components'

const TreatyItemContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
`;

const TreatyItemContainerWithWarning = styled(TreatyItemContainer)`
  border-bottom: ${
    props => (
      new Date(props.createdAt) > new Date(Date.now() - 8640000 * 5)
    ?
    'none'
    :
    '2px solid black'
  )};
`

const Button = styled.button`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`

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

const TreatyListItem = ({ treaty, onRemovePressed, onMarkActivePressed, onSignPressed }) => {
    const  Container = treaty.isActive ? TreatyItemContainer : TreatyItemContainerWithWarning
    return (
      <Container createdAt={treaty.createdAt}>
          <h3>{treaty.text}</h3>
          <p>
            Created at:&nbsp;
            {(new Date(treaty.createdAt)).toLocaleDateString()}
          </p>
          <div className="buttons-container">
              {treaty.status == 'Draft'
                ? <ActiveButton
                      onClick={() => onMarkActivePressed(treaty)}
                      >
                      Mark As Active
                  </ActiveButton>
                : null
              }
              {treaty.status == 'Active'
                ? <SignButton
                      onClick={() => onSignPressed(treaty.id)}
                      >
                      Sign
                  </SignButton>
                : null
              }
              <RemoveButton
                onClick={() => onRemovePressed(treaty)}
                >
                Remove
              </RemoveButton>
          </div>
      </Container>
);
}

export default TreatyListItem;
