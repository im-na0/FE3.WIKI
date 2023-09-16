import React from "react";

// styles
import styled from "styled-components";

// components
import SubPage from "./SubPage";

const Page = () => {
  return (
    <Container>
      <SubPage />
    </Container>
  );
};

export default Page;

const Container = styled.div`
  width: 100%;
`;
