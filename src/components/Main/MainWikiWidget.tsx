import React from "react";
import { WikiList } from "../../libs/firestore";
import styled from "styled-components";
import { theme } from "antd";

export const BorderTitle = styled.h4<{ $colorPrimary: string }>`
  border-left: 3px solid ${(props) => props.$colorPrimary};
  padding: 6px 1rem;
`;

export const WidgetItem = styled.div`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dfdfdf;
  a {
    display: block;
    color: inherit;
  }
  p {
    margin: 0;
    flex: 1;
  }
  .list-date {
    color: #999;
  }
`;

const MainWikiWidget = ({ wikis }: { wikis?: WikiList }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  wikis?.items?.sort((a, b) => b.date.toMillis() - a.date.toMillis());

  return (
    <div>
      <BorderTitle $colorPrimary={colorPrimary}>최근 위키 페이지</BorderTitle>
      <div>
        {wikis?.items.map((item) => (
          <WidgetItem key={item.date.toMillis()}>
            <p>{item.name}</p>
            <div className="list-date">
              <span>{item.date.toDate().getMonth() + 1}</span>.
              <span>{item.date.toDate().getUTCDate()}</span>
            </div>
          </WidgetItem>
        ))}
      </div>
    </div>
  );
};

export default MainWikiWidget;
