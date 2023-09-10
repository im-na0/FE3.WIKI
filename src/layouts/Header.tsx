import React from "react";
import { Layout, theme } from "antd";
const { Header } = Layout;
const MainHeader = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header style={{ background: colorBgContainer }}>
      <div>Logo</div>
    </Header>
  );
};

export default MainHeader;
