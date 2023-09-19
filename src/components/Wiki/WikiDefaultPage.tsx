import React from "react";
import { ReactComponent as Wiki } from "../../assets/wiki.svg";

// Style
import styled from "styled-components";

const WikiDefaultPage = () => {
  return (
    <Container>
      <h1>📘 위키 가이드</h1>

      <StyledDiv>
        <WikiIcon />
        <StyledText>
          <div>
            <h2>폴더 및 파일 관리</h2>
            <p>
              새 폴더를 추가하려면 &quot;새 폴더 추가&quot; 버튼을 클릭하세요.
              폴더는 날짜순으로 정렬됩니다.
            </p>
            <p>
              생성된 폴더의 오른쪽 메뉴를 클릭하여 폴더의 이름을 변경하거나
              폴더를 삭제할 수 있습니다.
            </p>
            <p>
              마찬가지로 폴더의 오른쪽 메뉴에서 새로운 파일을 생성할 수
              있습니다.
            </p>
            <p>
              새로운 파일을 클릭하면 에디터로 이동하고, 에디터에서 마크다운
              형식으로 글을 작성한 후 &quot;등록&quot; 버튼을 누르면 글 생성이
              완료됩니다.
            </p>
            <p>
              파일에서는 &quot;수정&quot; 버튼과 &quot;삭제&quot; 버튼을 통해
              글을 수정하거나 삭제할 수 있습니다.
            </p>
          </div>
          <div>
            <h2>폴더 순서 변경</h2>
            <p>
              이미 정렬된 폴더의 순서를 변경하려면 메뉴에서 폴더를 드래그하여
              순서를 바꿀 수 있습니다.
            </p>
            <p>아쉽게도 파일의 순서는 날짜순 외에는 정렬할 수 없습니다.</p>
          </div>
        </StyledText>
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
    font-size: 2rem;
  }
`;

const StyledDiv = styled.div`
  margin-top: 80px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const WikiIcon = styled(Wiki)`
  width: 33%;
`;

const StyledText = styled.div`
  width: 67%;
  margin-left: 20px;
  div {
    h2 {
      font-size: 1.5rem;
    }
    p {
      margin-bottom: 10px;
    }
  }
`;
