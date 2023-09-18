import React from "react";
import styled from "styled-components";
import { FormDataType } from "../type/form";

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

export const columns = [
  {
    title: "Name",
    render: (record: FormDataType) => (
      <div>
        <Image className="profile">
          <img src={record.photo} alt={record.name} />
        </Image>
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
];
