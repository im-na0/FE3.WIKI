import React from "react";
import styled from "styled-components";

const WikiDefaultPage = () => {
  return (
    <WikiDetailHolder>
      <div>
        <object data={process.env.PUBLIC_URL + "/wiki.svg"}></object>
        <p>왼쪽의 위키 폴더 목록을 클릭하면 상세정보가 이곳에 보여집니다.</p>
        <p>
          전체 위키의 FE3 WIKI 가이드를 참고하면 위키 페이지를 더욱 활용도 있게
          사용할 수 있습니다.
        </p>
      </div>
    </WikiDetailHolder>
  );
};

export default WikiDefaultPage;

const WikiDetailHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.01);
  object {
    display: block;
    max-width: 540px;
    margin: 0 auto;
  }
  p {
    display: block;
    margin-left: 140px;
    text-align: start;
  }
`;
