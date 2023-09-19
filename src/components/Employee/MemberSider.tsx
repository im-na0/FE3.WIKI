import React from "react";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

const items: MenuProps["items"] = [
  getItem("직원 리스트", "member", <UserOutlined />),
  getItem("팀 리스트", "team", <TeamOutlined />),
];

const { Sider } = Layout;

const MemberSider = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const onClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "member":
        navigate("/employee/");
        break;
      case "team":
        navigate("/employee/team");
        break;
    }
  };

  return (
    <Sider style={{ background: colorBgContainer }} width={200}>
      <Menu
        onClick={onClick}
        style={{ width: 200 }}
        defaultSelectedKeys={["member"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default MemberSider;
