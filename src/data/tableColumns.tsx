import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, message } from "antd";
import React from "react";
import styled from "styled-components";
import { FormDataType } from "../type/form";
import { useNavigate } from "react-router-dom";

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

export const columns = (handleDelete: (id: string) => void) => {
  const navigate = useNavigate();

  return [
    {
      title: "Name",
      render: (record: FormDataType) => (
        <div>
          <Image className="profile">
            <img src={record.photo} alt={record.name} />
          </Image>{" "}
          <div className="name">{record.name}</div>
          <div className="email">{record.email}</div>
        </div>
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
            onClick: ({ key }) => {
              if (key === "view") {
                if (record.id) {
                  navigate(`/employee/${record.id}`);
                }
              }
              if (key === "delete") {
                message.info("삭제되었습니다");
                if (record.id) {
                  handleDelete(record.id);
                }
              }
            },
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
