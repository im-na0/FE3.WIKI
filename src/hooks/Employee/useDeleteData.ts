import { db } from "../../libs/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { message } from "antd";

interface DeleteDataParams {
  COLLECTION_NAME: string;
}
export function useDeleteData({ COLLECTION_NAME }: DeleteDataParams) {
  const deleteData = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      message.success("삭제되었습니다");
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("삭제 중 오류가 발생했습니다 ");
    }
  };

  return { deleteData };
}
