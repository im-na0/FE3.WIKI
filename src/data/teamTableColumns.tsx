import { FormDataType } from "../type/form";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Tooltip, Col } from "antd";
import React from "react";
import { styled } from "styled-components";

const UserList = styled.ul`
  display: flex;
`;

export const columns = [
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
];
