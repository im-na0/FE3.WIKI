import React from "react";
import { FormDataType } from "../../type/form";
import { columns } from "../../data/tableColumns";
import { useFetchData } from "../../hook/Employee/useFetchData";
import { useDeleteData } from "../../hook/Employee/useDeleteData";
import { Table } from "antd";

interface MemberTableProps {
  setSelectedRowKeys: (keys: string[]) => void;
  searchText: string;
  filterValue: string;
}

export default function MemberTable({
  setSelectedRowKeys,
  searchText,
  filterValue,
}: MemberTableProps) {
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    ORDER: "name",
  };
  const data = useFetchData(fetchDataParams);
  const { deleteData } = useDeleteData();

  const handleDelete = async (id: string) => {
    deleteData(id);
  };

  const filteredData = data?.filter((item: FormDataType) => {
    if (!searchText) return true;
    const nameIncludes = item.name ? item.name.includes(searchText) : false;
    const departmentIncludes = item.department
      ? item.department.includes(searchText)
      : false;

    const filterMatch = !filterValue || item.department === filterValue;

    return (nameIncludes || departmentIncludes) && filterMatch;
  });

  return (
    <>
      {filteredData && (
        <Table
          dataSource={filteredData}
          columns={columns(handleDelete)}
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
