import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import {
  showAllTreatiesRequest,
} from "../redux/interactions";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import { showAllTreaties } from "../redux/actions";
import { StyledPopover, StyledPopoverTitle, ShowAllButton } from "./treatifyStyled";
import { 
  loadWeb3,
  loadAccount,
  loadTreatyIndex,
  loadTreatyIndexWeb3,
  loadTreatyContract,
  loadTreatyIndexContract,
  loadTreatyIndexContractWeb3 } from "../redux/interactions";
import {
  treatyIndexContractSelector,
  treatyIndexSelector,
} from "../redux/selectors";
import TreatyList from "./TreatyList";
import DisplayControls from "./DisplayControls";

const TreatyIndexView = ({
  dispatch,
  treatyIndex,
  treatyIndexContract,
  startLoadWeb3,
  startLoadAccount,
  startLoadTreatyIndex,
  startLoadTreatyIndexContract,
  onShowAllPressed,
}) => {
   useEffect(() => {
    async function initiate() {
      console.log("Start of initiate function in TreatyIndexView");
      const myWeb3 = await startLoadWeb3();
      console.log('myWeb3 :>> ', myWeb3);
      const myAccount = await startLoadAccount(myWeb3);
      console.log('myAccount :>> ', myAccount);
      const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
      console.log('treatyIndexContract :>> ', treatyIndexContract);
      const treatyIndex = await startLoadTreatyIndex(treatyIndexContract);
      console.log('treatyIndex :>> ', treatyIndex);
    }
    console.log("About to initiate TreatyIndexView");
    initiate();
    console.log("Done initiating TreatyIndexView");
  }, []);

  const loadingMessage = <div>Loading Treaty Index</div>;
  const isLoading = false;
  console.log('treatyIndex before context render:>> ', treatyIndex);
  const content = (
    <div>
      <TreatyIndexComponent 
        treatyIndexContract={treatyIndexContract}
        treatyIndex={treatyIndex}
      />
      <DisplayControls/>
    </div>
  );
  return isLoading ? loadingMessage : content;
};

const TreatyIndexComponent = ({treatyIndexContract, treatyIndex}) => (
      <OverlayTrigger
      trigger={["hover", "focus"]}
      placement={"right"}
      delay={{ show: 250, hide: 2000 }}
      overlay={treatyIndexPopover(treatyIndexContract, treatyIndex)}
      >
        <a href="#" style={{ marginTop: "40px", color: "white" }}>
          Show Project Wallet Board
        </a>
      </OverlayTrigger>
);

const treatyIndexPopover = (treatyIndexContract, treatyIndex) => {
  return (
  <StyledPopover id="treaty-index-popover" boundary="window">
      <StyledPopoverTitle as="h3">
        Project Board Address:{" "}
        {treatyIndexContract && treatyIndexContract._address}
      </StyledPopoverTitle>
      <StyledPopover.Content>
        <TreatyIndexTable treatyIndex={treatyIndex} />
      </StyledPopover.Content>
    </StyledPopover>
  )
}
  
  const TreatyIndexTable = ({treatyIndex}) => (
    <table className="table table-dark">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Contract Address</th>
        </tr>
      </thead>
      <tbody>
        {treatyIndex &&
          treatyIndex.map((treatyAddress, i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>{treatyAddress}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
  
function mapStateToProps(state) {
  return {
    treatyIndex: treatyIndexSelector(state),
    treatyIndexContract: treatyIndexContractSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startLoadWeb3: () => dispatch(loadWeb3()),
    startLoadAccount: (myWeb3) => dispatch(loadAccount(myWeb3)),
    startLoadTreatyIndex: (treatyIndexContract) =>
      dispatch(loadTreatyIndexWeb3(treatyIndexContract)),
    startLoadTreatyIndexContract: (myWeb3) =>
      dispatch(loadTreatyIndexContractWeb3(myWeb3)),
    onShowAllPressed: () => dispatch(showAllTreatiesRequest()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatyIndexView);
