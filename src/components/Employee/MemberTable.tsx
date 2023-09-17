import CustomTable from "../common/CustomTable";
import React, { useEffect, useState } from "react";
import { FormDataType } from "../../type/form";
import { db } from "../../libs/firebase";
import { TABLE_TITLE } from "../../constant/member";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { columns } from "../../data/tableColumns";

export default function MemberTable() {
  const [data, setData] = useState<FormDataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleDelete = async (id: string) => {
    try {
      // for (const id of selectedRowKeys) {
      //   await deleteDoc(doc(db, "Users", id));
      // }
      // setSelectedRowKeys([]);
      await deleteDoc(doc(db, "Users", id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Users"), orderBy("name"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: FormDataType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const selectedFields = {
          id: doc.id,
          ...data,
        };
        list.push(selectedFields);
      });

      const orderedData = list.map((item) => {
        const orderedItem: FormDataType = { id: item.id };
        for (const key of Object.keys(TABLE_TITLE)) {
          orderedItem[key] = item[key];
        }
        return orderedItem;
      });

      setData(orderedData);
    });

    return () => unsubscribe();
  }, []);

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
              console.log(selectedIds);
            },
          }}
        />
      )}
    </>
  );
}
