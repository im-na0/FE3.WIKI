import { message } from "antd";
import { FormDataType } from "../../type/form";
import {
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  ref,
} from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../libs/firebase";

interface UseMemberMutationParams {
  COLLECTION_NAME: string;
}

export function useUploadStorage() {
  const uploadStorage = async (file: File) => {
    const fileName = new Date().getTime() + file.name;
    try {
      const storageRef = ref(storage, `member/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      console.log("업로드 성공!");
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file: ", error);
      message.error("파일 업로드 중 오류가 발생했습니다 ");
    }
  };

  return { uploadStorage };
}

export function useDeleteStorage() {
  const deleteStorage = async (src: string) => {
    try {
      await deleteObject(ref(storage, src));
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error("파일 삭제 중 오류가 발생했습니다 ");
    }
  };

  return { deleteStorage };
}

export function useUpdateData({ COLLECTION_NAME }: UseMemberMutationParams) {
  const updateData = async (id: string, data: FormDataType) => {
    try {
      await setDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      console.log("스토어 업로드 성공!");
    } catch (error) {
      console.error("Error updating member: ", error);
      message.error("데이터 업데이트 중 오류가 발생했습니다 ");
    }
  };

  return { updateData };
}
