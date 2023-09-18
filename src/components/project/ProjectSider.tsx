import React from "react";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
  EditOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  getItem("전체 프로젝트", "all", <ProjectOutlined />),
  getItem("내 팀 프로젝트", "myteam", <ProjectOutlined />, [
    getItem("프론트엔드 개발팀", "fe", <UnorderedListOutlined />),
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/")[2];
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const onClick: MenuProps["onClick"] = (e) => {
    // console.log("click ", e);
    switch (e.key) {
      case "all":
        navigate("/project/all");
        break;
      case "fe":
        navigate("/project");
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
        defaultSelectedKeys={[currentPath ?? "fe"]}
        defaultOpenKeys={["myteam"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default ProjectSider;
