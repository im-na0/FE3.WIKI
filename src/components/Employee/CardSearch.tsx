import React from "react";

import { Input } from "antd";

const { Search } = Input;

export default function TableSearch() {
  return (
    <Search
      placeholder="input search text"
      allowClear
      size="large"
      style={{ width: 300 }}
    />
  );
}
