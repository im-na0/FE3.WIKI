import React from "react";

// styles
import styled from "styled-components";

// components
import SubPage from "./SubPage";

// Recoil
import { useRecoilValue } from "recoil";
import { currentFileTitle } from "../../store/wiki";

const Page = () => {
  const currentFile = useRecoilValue(currentFileTitle);
  return (
    <Container>
      {currentFile !== "" ? (
        <>
          <SubPage />
        </>
      ) : (
        <>
          <h1>초기화면 미지정</h1>
        </>
      )}
    </Container>
  );
};

export default Page;

const Container = styled.div`
  width: 100%;
`;
