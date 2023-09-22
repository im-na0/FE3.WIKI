import { EllipsisOutlined } from "@ant-design/icons";
import { Col, Dropdown, message, Row, Avatar } from "antd";
import React from "react";
import { FormDataType } from "../type/form";
import { NavigateFunction } from "react-router-dom";
import styled, { css } from "styled-components";

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
              size={{ xs: 32, xxl: 43 }}
            >
              {record.name?.charAt(0)}
            </Avatar>
          </Col>
          <Col flex="auto">
            <NameStyle className="name">{record.name}</NameStyle>
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
      render: (record: FormDataType) => (
        <AccessStyle access={record.access ? String(record.access) : ""}>
          {record.access}
        </AccessStyle>
      ),
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

const NameStyle = styled.span`
  font-size: 0.9rem;
`;

const AccessStyle = styled.span<{ access: string }>`
  font-size: 0.8rem;
  font-weight: 500;
  color: #a67aff;
  padding: 3px 13px;
  background: #f4eeff;
  border-radius: 1rem;
  letter-spacing: -0.5px;

  ${(props) =>
    props.access === "admin" &&
    css`
      background: #e4f8da;
      color: #88c851;
    `}
`;
