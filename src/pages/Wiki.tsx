import React, { useEffect } from "react";

// components
import Nav from "../components/Wiki/Nav";
import Page from "../components/Wiki/Page";

// styles
import styled from "styled-components";

const Wiki = () => {
  return (
    <StyledContainer>
      <Nav />
      <Page />
    </StyledContainer>
  );
};

export default Wiki;

const StyledContainer = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  display: flex;
`;
