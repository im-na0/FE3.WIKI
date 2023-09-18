import { FilterFilled } from "@ant-design/icons";
import React from "react";
import { Button, Dropdown, MenuProps } from "antd";

interface MemberFilterProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  sortValue: string;
  setSortValue: (value: string) => void;
}

export default function MemberFilter({
  filterValue,
  setFilterValue,
  sortValue,
  setSortValue,
}: MemberFilterProps) {
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "sortDefault":
        setSortValue("");
        break;
      case "sortName":
        setSortValue(e.key);
        break;
      case "sortTeam":
        setSortValue(e.key);
        break;
      case "membersAll":
        setFilterValue("");
        break;
      case "membersManager":
        setFilterValue(e.key);
        break;
      case "membersMember":
        setFilterValue(e.key);
        break;
      default:
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      type: "group",
      label: "SORT BY:",
      children: [
        {
          label: <span>default</span>,
          key: "sortDefault",
        },
        {
          label: <span>Name</span>,
          key: "sortName",
        },
        {
          label: <span>Team</span>,
          key: "sortTeam",
        },
      ],
    },
    {
      type: "group",
      label: "MEMBERS:",
      children: [
        {
          label: <span>All</span>,
          key: "membersAll",
        },
        {
          label: <span>Manager</span>,
          key: "membersManager",
        },
        {
          label: <span>Member</span>,
          key: "membersMember",
        },
      ],
    },
  ];

  return (
    <div className="filter-btn">
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        placement="bottomLeft"
        trigger={["click"]}
      >
        <Button size="large">
          <FilterFilled />
          <span>Filter</span>
        </Button>
      </Dropdown>
    </div>
  );
}
