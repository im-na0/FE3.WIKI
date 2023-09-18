import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useFetchData } from "../../hook/Employee/useFetchData";
import { useDeleteData } from "../../hook/Employee/useDeleteData";
import { FormDataType } from "../../type/form";
import { columns } from "../../data/tableColumns";

interface MemberTableProps {
  setSelectedRowKeys: (keys: string[]) => void;
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
    ORDER: "",
  };
  const data = useFetchData(fetchDataParams);
  const { deleteData } = useDeleteData();

  const handleDelete = async (id: string) => {
    deleteData(id);
  };

  const [filteredData, setFilteredData] = useState<FormDataType[] | null>(null);

  useEffect(() => {
    // 필터링 로직을 구현
    const filteredData = data
      ?.filter((item: FormDataType) => {
        if (!searchText) return true;
        const nameIncludes = item.name ? item.name.includes(searchText) : false;
        const departmentIncludes = item.department
          ? item.department.includes(searchText)
          : false;

        const filterMatch = !filterValue || item.department === filterValue;

        return (nameIncludes || departmentIncludes) && filterMatch;
      })
      .map((item) => ({
        ...item,
        key: item.id,
      }));
    // 필터된 데이터를 setState
    setFilteredData(filteredData);
  }, [data, searchText, sortValue, filterValue]);

  return (
    <>
      {filteredData && (
        <Table
          dataSource={filteredData}
          columns={columns(handleDelete, filterValue, sortValue)}
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
