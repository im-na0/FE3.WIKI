import { CloudDownloadOutlined } from "@ant-design/icons";
import React from "react";
import { Button } from "antd";

export default function TableExportBtn() {
  return (
    <Button size="large">
      <CloudDownloadOutlined />
      <span>Export</span>
    </Button>
  );
}
