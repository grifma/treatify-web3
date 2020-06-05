import React from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  margin: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  background: #343a40;
  color: white;
  width: 100vw;
  height: 100vh;
`;

const DarkContainer = () => (
  <div style={{ background: "#343A40", height: "2000px" }}></div>
);

export default DarkContainer;
