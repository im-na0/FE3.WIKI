import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useDeleteData } from "../../hooks/Employee/useDeleteData";
import { FormDataType } from "../../type/form";
import { columns } from "../../data/tableColumns";
import { useFetchData } from "../../hooks/Employee/useFetchData";

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
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    ORDER: "name",
  };
  const { deleteData } = useDeleteData();
  const initialUserData: FormDataType[] = useFetchData(fetchDataParams);

  console.log(initialUserData);
  const [filteredData, setFilteredData] =
    useState<FormDataType[]>(initialUserData);

  useEffect(() => {
    const filteredByAccess = filterValue
      ? initialUserData.filter(
          (item: FormDataType) => item.access === filterValue,
        )
      : initialUserData;

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
  }, [initialUserData, filterValue, sortValue, searchText]);

  const handleDelete = async (id: string) => {
    deleteData(id);
  };

  return (
    <>
      {filteredData && (
        <Table
          dataSource={filteredData}
          columns={columns(handleDelete)}
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
