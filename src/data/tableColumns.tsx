import { EllipsisOutlined } from "@ant-design/icons";
import { Col, Dropdown, message, Row, Avatar } from "antd";
import React from "react";
import styled from "styled-components";
import { FormDataType } from "../type/form";
import { NavigateFunction } from "react-router-dom";

export const columns = (
  navigate: NavigateFunction,
  deleteData: (arg1: string, arg2: string) => void,
  userAccess: string | null,
  checkAdminPermission: () => boolean,
) => {
  const handleDelete = async (id: string, teamId: string) => {
    if (!checkAdminPermission()) return;
    deleteData(id, teamId);
    message.info("삭제되었습니다");
  };

  const handleMenuClick = (record: FormDataType, key: string) => {
    if (key === "view") {
      if (record.id) {
        navigate(`/employee/${record.id}`);
      }
    }
    if (key === "delete") {
      console.log(record);
      if (record.id) {
        handleDelete(record.id, record.teamId!);
      }
    }
  };

  return [
    {
      title: "Name",
      render: (record: FormDataType) => (
        <Row gutter={16}>
          <Col flex="0 1">
            <Avatar
              src={record.photo}
              alt={record.name}
              size={{ xs: 24, xl: 32, xxl: 43 }}
            >
              {record.name?.charAt(0)}
            </Avatar>
          </Col>
          <Col flex="auto">
            <div className="name">{record.name}</div>
            <div className="email">{record.email}</div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Department",
      render: (record: FormDataType) => (
        <div>
          <div className="name">{record.department}</div>
          <div className="address">{record.position}</div>
        </div>
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
      title: "Access",
      render: (record: FormDataType) => <div>{record.access}</div>,
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "",
      render: (record: FormDataType) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: <span>View Profile</span>,
              },
              {
                key: "delete",
                label: <span>Delete</span>,
                danger: true,
              },
            ],
            onClick: ({ key }) => handleMenuClick(record, key),
          }}
          autoAdjustOverflow={true}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Btn onClick={(e) => e.preventDefault()}>
            <EllipsisOutlined />
          </Btn>
        </Dropdown>
      ),
    },
  ];
};

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
