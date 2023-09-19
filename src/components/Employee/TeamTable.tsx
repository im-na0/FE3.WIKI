import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { FormDataType } from "../../type/form";
import { useFetchTeamData } from "../../hooks/Employee/useFetchTeamData";
import { columns } from "../../data/teamTableColumns";
import { useNavigate } from "react-router-dom";

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
  const [filteredData, setFilteredData] = useState<FormDataType[]>(teamData);
  const navigate = useNavigate();

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

  console.log(filteredData);

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns(navigate)}
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
