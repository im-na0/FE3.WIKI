import React, { useState, useEffect } from "react";
import { Spin, Table } from "antd";
import { useDeleteData } from "../../hooks/Employee/useDeleteData";
import { FormDataType } from "../../type/form";
import { columns } from "../../data/tableColumns";
import { useFetchData } from "../../hooks/Employee/useFetchData";
import { useNavigate } from "react-router-dom";

type SelectedRowData = {
  id: string;
  teamId?: string;
};

interface MemberTableProps {
  setSelectedRowKeys: (keys: SelectedRowData[]) => void;
  searchText: string;
  filterValue: string;
  sortValue: string;
}

export default function MemberTable({
  setSelectedRowKeys,
  searchText,
  filterValue,
  sortValue,
}: MemberTableProps) {
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    ORDER: "name",
  };
  const data = useFetchData(fetchDataParams);

  const [filteredData, setFilteredData] = useState<FormDataType[]>(data);

  const navigate = useNavigate();

  useEffect(() => {
    const filteredByAccess = filterValue
      ? data.filter((item: FormDataType) => item.access === filterValue)
      : data;

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
  }, [data, filterValue, sortValue, searchText]);

  return (
    <>
      {filteredData && (
        <Table
          dataSource={filteredData}
          columns={columns(navigate)}
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: true,
          }}
          rowSelection={{
            onChange: (
              selectedKeys: React.Key[],
              selectedRows: FormDataType[],
            ) => {
              const selectedIds = selectedRows
                .filter((row) => row.id)
                .map((row) => ({
                  id: row.id!,
                  teamId: row.teamId,
                }));
              console.log(selectedIds);
              setSelectedRowKeys(selectedIds);
            },
          }}
        />
      )}
    </>
  );
}
