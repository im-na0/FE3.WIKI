import { FilterFilled } from "@ant-design/icons";
import React from "react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";

const items: MenuProps["items"] = [
  {
    type: "group",
    label: "SORT BY:",
    children: [
      {
        label: "default",
        key: "sortDefault",
      },
      {
        label: "Name",
        key: "sortName",
      },
      {
        label: "Team",
        key: "sortTeam",
      },
    ],
  },
  {
    type: "group",
    label: "MEMBERS:",
    children: [
      {
        label: "All",
        key: "membersAll",
      },
      {
        label: "Manager",
        key: "membersManager",
      },
      {
        label: "Member",
        key: "membersMember",
      },
    ],
  },
];

interface MemberFilterProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export default function MemberFilter({
  filterValue,
  setFilterValue,
}: MemberFilterProps) {
  const handleFilterClick = (key: string) => {
    console.log("Filter clicked:", key);
    setFilterValue(key);
  };

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomLeft"
      className="filter-btn"
      trigger={["click"]}
    >
      <Button size="large">
        <FilterFilled />
        <span>Filter</span>
      </Button>
    </Dropdown>
  );
}
