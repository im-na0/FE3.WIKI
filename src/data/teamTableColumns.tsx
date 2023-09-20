import { FormDataType } from "../type/form";
import { Avatar, Dropdown, message, Tooltip } from "antd";
import React from "react";
import { styled } from "styled-components";
import { EllipsisOutlined } from "@ant-design/icons";
import { useDeleteData } from "../hooks/Employee/useDeleteData";
import { NavigateFunction } from "react-router-dom";

const DeleteDataParams = {
  COLLECTION_NAME: "Teams",
};

export const columns = (navigate: NavigateFunction) => {
  const { deleteData } = useDeleteData(DeleteDataParams);

  const handleMenuClick = (record: FormDataType, key: string) => {
    if (key === "view") {
      if (record.id) {
        navigate(`/employee/team/${record.id}`);
      }
    }
    if (key === "delete") {
      message.info("삭제되었습니다");
      if (record.id) {
        handleDelete(record.id);
      }
    }
  };

  const handleDelete = async (id: string) => {
    console.log(id);
    deleteData(id);
  };

  return [
    {
      title: "Team",
      dataIndex: "teamName",
    },
    {
      title: "Member",
      render: (record: FormDataType) => (
        <UserList>
          <Avatar.Group
            maxCount={3}
            maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
          >
            {record.teamUsers.map((user: FormDataType, index: number) => (
              <span key={`${user.id}-${index}`}>
                <Tooltip title={user.name} placement="top">
                  <Avatar key={`${user.id}-${index}`} src={user.photo}>
                    {user.name}
                  </Avatar>
                </Tooltip>
              </span>
            ))}
          </Avatar.Group>
        </UserList>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "CreatedAt",
      render: (record: FormDataType) => {
        if (record && record.createdAt) {
          const timestamp = record.createdAt;
          const date = timestamp.toDate();
          const options = { year: "numeric", month: "long", day: "numeric" };
          const formattedDate = date.toLocaleString("ko-KR", options);
          return <span>{formattedDate}</span>;
        }
        return null;
      },
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

const Btn = styled.a`
  display: block;
  padding: 0.3rem;
`;

const UserList = styled.ul`
  display: flex;
`;
