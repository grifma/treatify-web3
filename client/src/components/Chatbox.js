// import React, { Component, useEffect } from "react";
// import { connect } from "react-redux";
// // import { Main, LSide, RSide, Header, Footer, Grid } from "./treatifyStyled";
// import styled from "styled-components";
// import { Button, Popover, OverlayTrigger } from "react-bootstrap";
// import { load3boxRequest } from "../redux/interactions";
// import {
//   threeboxSelector,
//   openSpaceSelector,
//   accountSelector,
// } from "../redux/selectors";

// export const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(12, 1fr);

//   @media only screen and (min-width: 769px) {
//     grid-template-rows: 100px 400px 100px;
//   }
//   @media only screen and (max-width: 768px) {
//   }
// `;

// export const GridItem = styled.div`
//   color: white;
// `;

// export const Header = styled(GridItem)`
//   @media only screen and (min-width: 769px) {
//     grid-column: span 12;
//   }
//   @media only screen and (max-width: 768px) {
//     order: 1;
//     grid-column: span 12;
//   }
// `;

// export const LSide = styled(GridItem)`
//   @media only screen and (min-width: 769px) {
//     grid-column: span 2;
//     overflow: hidden;
//   }
//   @media only screen and (max-width: 768px) {
//     grid-column: span 12;
//     order: 3;
//   }
// `;

// export const Main = styled(GridItem)`
//   @media only screen and (min-width: 769px) {
//     grid-column: span 8;
//   }
//   @media only screen and (max-width: 768px) {
//     grid-column: span 12;
//     order: 2;
//   }
// `;

// export const RSide = styled(GridItem)`
//   @media only screen and (min-width: 769px) {
//     grid-column: span 2;
//   }
//   @media only screen and (max-width: 768px) {
//     grid-column: span 12;
//     order: 4;
//   }
// `;

// export const Footer = styled(GridItem)`
//   grid-column: span 12;
//   order: 5;
// `;

// // const connectThreebox = async (e) => {
// //   //console.log("Deprecated - code removed");
// //   e.preventDefault();
// //   startLoad3box(account, provider);
// //   // const myWeb3 = await startLoadWeb3();
// //   // await startLoadAccount(myWeb3);
// //   // const simpleStorageContract = await startLoadContract(myWeb3);
// //   // const treatyIndexContract = await startLoadTreatyIndexContract(myWeb3);
// //   // await startLoadTreatyIndex(treatyIndexContract);
// //   // await loadStoredData(simpleStorageContract);
// //   // subscribeToAccountsChanging(myWeb3);
// // };

// // const ThreeboxConnectForm = () => (
// //   <form onSubmit={connectThreebox}>
// //     <div className="form-group row">
// //       <div className="col-12">
// //         <button type="submit" className={`w-100 btn text-truncate`}>
// //           Connect Threebox
// //         </button>
// //       </div>
// //     </div>
// //   </form>
// // );

// const wait10 = async () => setTimeout(() => console.log("wait10 done"), 3000);

// const Chatbox = ({
//   title,
//   account,
//   provider,
//   startLoad3box,
//   accountFromState,
// }) => {
//   useEffect(() => {
//     async function initiate() {
//       console.log("waiting");
//       await wait10;
//       console.log(
//         `about to trigger startLoad3box with ${accountFromState} ${provider}`
//       );
//       console.log("accountFromProp", account);
//       console.log("accountFromState", await accountFromState);
//       console.log("provider", provider);
//       const result = await startLoad3box(accountFromState, provider);
//       console.log(`returned with result: `, result);
//     }
//     initiate();
//   }, []);

//   //console.log("Chat component");
//   //console.log("title", title);
//   //console.log("account", account);
//   //console.log("provider", provider);

//   const emptyComponent = () => <div>EMPTY</div>;
//   const loadingMessage = <div>Loading chat component</div>;
//   const isLoading = false;
//   const content = (
//     <div class="isDark">
//       THREEBOX
//       {/* <ThreeboxConnectForm /> */}
//     </div>
//   );
//   return isLoading ? loadingMessage : content;
// };

// function mapStateToProps(state) {
//   return {
//     threebox: threeboxSelector(state),
//     openSpace: openSpaceSelector(state),
//     accountFromState: accountSelector(state),
//     // accountFromState: wait10().then(() => {
//     //   return accountSelector(state);
//     // }),
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     startLoad3box: (address, provider) =>
//       dispatch(load3boxRequest(address, provider)),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Chatbox);
