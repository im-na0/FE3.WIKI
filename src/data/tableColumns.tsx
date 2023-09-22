import { EllipsisOutlined } from "@ant-design/icons";
import { Col, Dropdown, message, Row } from "antd";
import React from "react";
import styled from "styled-components";
import { FormDataType } from "../type/form";
import { useDeleteData } from "../hooks/Employee/useDeleteData";
import { NavigateFunction } from "react-router-dom";

const DeleteDataParams = {
  COLLECTION_NAME: "Users",
};

export const columns = (navigate: NavigateFunction) => {
  const { deleteData } = useDeleteData(DeleteDataParams);

  const handleDelete = async (id: string, teamId: string) => {
    console.log(id);
    deleteData(id, teamId);
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
        message.info("삭제되었습니다");
      }
    }
  };

  return [
    {
      title: "Name",
      render: (record: FormDataType) => (
        <Row gutter={16}>
          <Col flex="0 1">
            <Image className="profile">
              <img src={record.photo} alt={record.name} />
            </Image>{" "}
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
