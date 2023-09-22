import React, { useState, useEffect, useMemo } from "react";
import { Table } from "antd";
import { FormDataType } from "../../type/form";
import { columns } from "../../data/tableColumns";
import { useFetchData } from "../../hooks/Employee/useFetchData";
import { useNavigate } from "react-router-dom";
import { useDeleteData } from "../../hooks/Employee/useDeleteData";
import useUserAccess from "../../hooks/Employee/useUserAccess";

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
  const { deleteData } = useDeleteData({ COLLECTION_NAME: "Users" });
  const { userAccess, checkAdminPermission } = useUserAccess();
  const memoizedColumns = useMemo(
    () => columns(navigate, deleteData, userAccess, checkAdminPermission),
    [navigate, deleteData, userAccess, checkAdminPermission],
  );

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
          columns={memoizedColumns}
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
              setSelectedRowKeys(selectedIds);
            },
          }}
        />
      )}
    </>
  );
}
