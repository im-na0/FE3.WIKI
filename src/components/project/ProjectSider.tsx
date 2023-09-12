import React from "react";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  ProjectOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("프로젝트", "project", <ProjectOutlined />, [
    getItem("전체 프로젝트", "all", <UnorderedListOutlined />),
    getItem("진행중인 프로젝트", "progress", <ClockCircleOutlined />),
    getItem("예정된 프로젝트", "plus", <PlusCircleOutlined />),
    getItem("완료된 프로젝트", "completed", <CheckCircleOutlined />),
  ]),
];

const { Sider } = Layout;

const NewProjectBtn = styled.div<{ $primary: string }>`
  background: ${(props) => props.$primary};
  a {
    display: block;
    padding: 12px 10px 12px 24px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin-left: 4px;
  }
`;

const ProjectSider = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    switch (e.key) {
      case "all":
        navigate("/project/all");
        break;
      case "progress":
        navigate("/project/progress");
        break;
      case "plus":
        navigate("/project/plus");
        break;
      case "completed":
        navigate("/project/completed");
        break;
    }
  };

  return (
    <Sider style={{ background: colorBgContainer }} width={200}>
      <NewProjectBtn $primary={colorPrimary}>
        <Link to={"/project/new"}>
          <EditOutlined /> 새 프로젝트 추가
        </Link>
      </NewProjectBtn>
      <Menu
        onClick={onClick}
        style={{ width: 200 }}
        defaultSelectedKeys={["all"]}
        defaultOpenKeys={["project"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default ProjectSider;
