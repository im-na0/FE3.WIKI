import React from "react";
import { Space } from "antd";
import styled from "styled-components";
import MemberFilter from "./MemberFilter";
import MemberSearch from "./MemberSearch";
import MemberControlMenu from "./MemberControlMenu";
import MemberExportBtn from "./MemberExportBtn";

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 1.5rem;
`;

const ToggleWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

export default function CardHeading() {
  return (
    <CardHeader className="card-header">
      <ToggleWrap>
        <Space direction="vertical">
          <MemberFilter />
        </Space>
        <Space direction="vertical">
          <MemberSearch />
        </Space>
      </ToggleWrap>
      <ToggleWrap>
        <MemberExportBtn />
        <Space direction="vertical">
          <Space wrap>
            <MemberControlMenu />
          </Space>
        </Space>
      </ToggleWrap>
    </CardHeader>
  );
}
