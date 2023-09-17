import React from "react";

// styles
import styled from "styled-components";

// components
import WikiNav from "../components/Wiki/WikiNav";
import Page from "../components/Wiki/Page";

const Wiki = () => {
  return (
    <StyledContainer>
      <WikiNav />
      <Page />
    </StyledContainer>
  );
};

export default Wiki;

const StyledContainer = styled.div`
  margin: 0;
  padding: 0;
  width: 100vw;
  display: flex;
`;
