import CustomTable from "../common/CustomTable";
import React, { useState } from "react";
import { FormDataType } from "../../type/form";
import { columns } from "../../data/tableColumns";
import { useFetchData } from "../../hook/Employee/useFetchData";
import { useDeleteData } from "../../hook/Employee/useDeleteData";

interface MemberTableProps {
  setSelectedRowKeys: (keys: string[]) => void;
}

export default function MemberTable({ setSelectedRowKeys }: MemberTableProps) {
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    ORDER: "name",
  };
  const data = useFetchData(fetchDataParams);
  const { deleteData } = useDeleteData();
  const handleDelete = async (id: string) => {
    deleteData(id);
  };
  return (
    <>
      {data && (
        <CustomTable
          data={data}
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
