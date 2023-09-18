import { useState, useEffect } from "react";
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  QuerySnapshot,
} from "firebase/firestore";
import { FormDataType } from "../../type/form";
import { TABLE_TITLE } from "../../constant/member";
import { message } from "antd";

interface FetchDataParams {
  COLLECTION_NAME: string;
  ORDER: string;
}

export function useFetchData({ COLLECTION_NAME, ORDER }: FetchDataParams) {
  const [data, setData] = useState<FormDataType[]>([]);

  useEffect(() => {
    let q = query(collection(db, COLLECTION_NAME));
    if (ORDER) {
      q = query(q, orderBy(ORDER));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
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
      },
      (error) => {
        console.error("Error fetching data:", error);
        message.error("데이터를 불러올 수 없습니다!");
        return () => {
          unsubscribe(); // 구독 해지
        };
      },
    );
  }, [COLLECTION_NAME, ORDER]);

  return data;
}
