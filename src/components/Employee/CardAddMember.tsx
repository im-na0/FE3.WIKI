import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";

const items: MenuProps["items"] = [
  {
    label: "Add Member",
    key: "addMember",
  },
  {
    label: "Add Team",
    key: "addTeam",
  },
];

export default function TableAddMember() {
  return (
    <Dropdown
      menu={{ items }}
      autoAdjustOverflow={true}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button type="primary" icon={<PlusOutlined />} size="large" />
    </Dropdown>
  );
}
