import { EllipsisOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Col, Row, Table, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";

import styled from "styled-components";

interface DataType {
  key: React.Key;
  name: string;
  department: string;
  position: string;
  phone: string;
  address: string;
  team: string;
  profile: string;
  accessLevel: string;
}

const Image = styled.span`
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  & > img {
    width: 100%;
  }
`;
const Btn = styled.a`
  display: block;
  padding: 0.3rem;
`;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Edit
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        View Profile
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Delete
      </a>
    ),
    danger: true,
  },
];

export default function MemberTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      render: (record) => (
        <Row gutter={16}>
          <Col flex="0 1">
            {" "}
            <Image className="profile">
              <img src={record.profile} alt={record.name} />
            </Image>{" "}
          </Col>
          <Col flex="auto">
            {" "}
            <div className="name">{record.name}</div>
            <div className="address">{record.address}</div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Department",
      render: (record) => (
        <Row gutter={16}>
          <Col flex="auto">
            <div className="name">{record.department}</div>
            <div className="address">{record.position}</div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Team",
      dataIndex: "team",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "AccessLevel",
      dataIndex: "accessLevel",
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "",
      render: () => (
        <a>
          <Dropdown
            menu={{ items }}
            autoAdjustOverflow={true}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Btn onClick={(e) => e.preventDefault()}>
              <EllipsisOutlined />
            </Btn>
          </Dropdown>
        </a>
      ),
    },
  ];

  const dataSource: DataType[] = [
    {
      key: "1",
      name: "박나영",
      department: "Information Technology",
      position: "Front-end Developer",
      phone: "010-5555-5555",
      address: "myemail@example.com",
      team: "이정도면 껌이조",
      profile:
        "https://deploy-preview-66--effulgent-axolotl-ab38e8.netlify.app/asset/member1.png",
      accessLevel: "Member",
    },
    {
      key: "2",
      name: "김땡땡",
      department: "Information Technology",
      position: "Back-end Developer",
      phone: "010-5555-5555",
      address: "myemail@example.com",
      team: "가보자고",
      profile:
        "https://deploy-preview-66--effulgent-axolotl-ab38e8.netlify.app/asset/member2.png",
      accessLevel: "Member",
    },
    {
      key: "3",
      name: "이땡땡",
      department: "Information Technology",
      position: "Front-end Developer",
      phone: "010-5555-5555",
      address: "myemail@example.com",
      team: "가보자고",
      profile:
        "https://deploy-preview-66--effulgent-axolotl-ab38e8.netlify.app/asset/member3.png",
      accessLevel: "Manager",
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows,
      );
    },
  };

  return (
    <>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
}
