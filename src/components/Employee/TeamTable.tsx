import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { FormDataType } from "../../type/form";
import { useFetchTeamData } from "../../hooks/Employee/useFetchTeamData";
import { columns } from "../../data/teamTableColumns";

interface MemberTableProps {
  setSelectedRowKeys: (keys: string[]) => void;
  searchText: string;
  filterValue: string;
  sortValue: string;
}

export default function TeamTable({
  setSelectedRowKeys,
  searchText,
  filterValue,
  sortValue,
}: MemberTableProps) {
  const { loading, teamData } = useFetchTeamData();

  const [filteredData, setFilteredData] = useState<FormDataType[]>([]); // 초기값을 빈 배열로 설정

  useEffect(() => {
    const filteredByAccess = filterValue
      ? teamData.filter((item: FormDataType) => item.access === filterValue)
      : teamData;

    const searchedData = filteredByAccess.filter((item: FormDataType) => {
      if (!searchText) return true;
      const nameIncludes = item.name ? item.name.includes(searchText) : false;
      const departmentIncludes = item.department
        ? item.department.includes(searchText)
        : false;
      return nameIncludes || departmentIncludes;
    });

    const sortedDataSource = [...searchedData];
    switch (sortValue) {
      case "sortName":
        sortedDataSource.sort((a, b) =>
          (a.name ?? "").localeCompare(b.name ?? ""),
        );
        break;
      case "sortTeam":
        sortedDataSource.sort((a, b) =>
          (a.team ?? "").localeCompare(b.team ?? ""),
        );
        break;
      default:
        break;
    }

    const dataWithKeys = sortedDataSource.map((item) => ({
      ...item,
      key: item.id,
    }));

    setFilteredData(dataWithKeys);
  }, [teamData, filterValue, sortValue, searchText]);

  const handleDelete = async (id: string) => {
    // deleteData(id);
  };

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          scroll={{ x: "max-content" }}
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "20"],
          }}
          rowSelection={{
            onChange: (
              selectedKeys: React.Key[],
              selectedRows: FormDataType[],
            ) => {
              const selectedIds = selectedRows
                .filter((row) => typeof row.id !== "undefined")
                .map((row) => row.id) as string[];
              setSelectedRowKeys(selectedIds);
            },
          }}
        />
      )}
    </>
  );
}
