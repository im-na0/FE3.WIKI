import React from "react";
import { Button, Space } from "antd";
import styled from "styled-components";
import TableFilter from "./CardFilter";
import TableSearch from "./CardSearch";
import TableAddMember from "./CardAddMember";
import TableExportBtn from "./CardExportBtn";

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
          <TableFilter />
        </Space>
        <Space direction="vertical">
          <TableSearch />
        </Space>
      </ToggleWrap>
      <ToggleWrap>
        <TableExportBtn />
        <Space direction="vertical">
          <Space wrap>
            <TableAddMember />
          </Space>
        </Space>
      </ToggleWrap>
    </CardHeader>
  );
}
