import React from "react";
import { ReactComponent as Wiki } from "../../assets/wiki.svg";

// Style
import styled from "styled-components";

const WikiDefaultPage = () => {
  return (
    <Container>
      <h1>📘 위키 가이드</h1>

      <StyledDiv>
        <StyledText>
          <div>
            <h3>폴더 기능 정리</h3>
            <ul>
              <li>새 폴더 추가 버튼을 눌러...</li>
              <li>점 아이콘을 클릭해 폴더명을 변경해...</li>
              <li>점 아이콘을 클릭해 폴더를 삭제해</li>
            </ul>
          </div>
          <div>
            <h3>파일 기능 정리</h3>
            <ul>
              <li>점 아이콘을 클릭해 새로운 파일을 생성해...</li>
              <li>파일에서 파일 제목을 변경...</li>
              <li>파일에서 파일 내용을 수정...</li>
              <li>파일에서 파일을 삭제...</li>
            </ul>
          </div>
        </StyledText>
        <Wiki />
      </StyledDiv>
    </Container>
  );
};

export default WikiDefaultPage;

const Container = styled.div`
  margin: -10px;
  padding: 0;
  margin-left: 10px;
  h1 {
    width: 185px;
    font-size: 2rem;
  }
`;
const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
const StyledText = styled.div`
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 100px;
  div {
    h3 {
      font-size: 1.5rem;
    }
  }
`;
