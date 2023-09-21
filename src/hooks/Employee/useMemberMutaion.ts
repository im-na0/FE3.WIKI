import React, { useState } from "react";
import { message } from "antd";
import { FormDataType, TeamType } from "../../type/form";
import {
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  ref,
} from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage, auth } from "../../libs/firebase";

interface UseMemberMutationParams {
  COLLECTION_NAME: string;
}

interface UserData {
  key: string;
  title: string;
}

export function useUploadStorage() {
  const uploadStorage = async (file: File) => {
    const fileName = new Date().getTime() + file.name;
    try {
      const storageRef = ref(storage, `member/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      message.success("업로드 성공!");
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
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });

      message.success("업데이트 성공!");
    } catch (error) {
      console.error("Error updating member: ", error);
      message.error("데이터 업데이트 중 오류가 발생했습니다 ");
    }
  };

  return { updateData };
}

export async function userFetchTeamsData({
  COLLECTION_NAME,
}: UseMemberMutationParams) {
  try {
    const docRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(docRef);
    const data: UserData[] = [];
    querySnapshot.forEach((doc) => {
      data.push({
        key: doc.id,
        title: doc.data().teamName,
      });
    });
    return data;
  } catch (error) {
    console.error("Error fetching collections: ", error);
    message.error("데이터를 불러오는 중 오류가 발생했습니다");
  }
}

export const useUploadData = (COLLECTION_NAME: string) => {
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const userUid = user.uid;
  const userDocRef = doc(db, COLLECTION_NAME, userUid);

  const uploadStorage = async (file: File) => {
    setUploading(true);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, `member/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", null, null, async () => {
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      setUploading(false);
    });
  };

  const uploadStore = async (data: any) => {
    try {
      await setDoc(userDocRef, data, { merge: true }); // Using merge: true to update/overwrite
      message.success("데이터가 업로드되었습니다.");
    } catch (error) {
      message.error("데이터 업로드 중 오류가 발생했습니다.");
      console.error("데이터 업로드 중 오류 발생:", error);
    }
  };

  return {
    uploadStorage,
    uploadStore,
    uploading,
    downloadURL,
  };
};
