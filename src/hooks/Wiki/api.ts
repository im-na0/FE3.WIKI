// Firebase
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

interface IState {
  name: string;
  subName: string;
}

type RefreshFunction = () => void;

// 새로운 폴더 생성
export const addFolder = async (
  folderName: string,
  refreshFc: RefreshFunction,
): Promise<void> => {
  if (folderName.length > 0) {
    await addDoc(collection(db, "WikiPage"), {
      title: folderName,
      items: [],
    });
    refreshFc();
  }
};

// 폴더 이름 변경
export const changeFolderName = async (
  currentFolderName: string,
  newFolderName: string,
  refreshFc: RefreshFunction,
): Promise<void> => {
  try {
    const q = query(
      collection(db, "WikiPage"),
      where("title", "==", currentFolderName),
    );
    const querySnapshot = await getDocs(q);
    const folderDoc = querySnapshot.docs[0];
    if (folderDoc) {
      await updateDoc(folderDoc.ref, {
        title: newFolderName,
      });
    }
    refreshFc;
  } catch (e) {
    console.error(e);
  }
};

// 새로운 파일 생성
export const addFile = async (
  currentFileName: string,
  state: IState,
  refreshFc: RefreshFunction,
): Promise<void> => {
  try {
    const q = query(
      collection(db, "WikiPage"),
      where("title", "==", currentFileName),
    );
    const querySnapshot = await getDocs(q);
    const folderDoc = querySnapshot.docs[0];
    const exist = folderDoc.data().items;
    const date = new Date();
    const newFileData = {
      name: state.name,
      subName: state.subName,
      date: date,
    };
    exist.push(newFileData);
    await updateDoc(folderDoc.ref, {
      items: exist,
    });

    refreshFc();
  } catch (e) {
    console.error(e);
  }
};

// 폴더 삭제
export const deleteFolder = async (
  folderName: string,
  state: (value: boolean) => void,
) => {
  try {
    const q = query(
      collection(db, "WikiPage"),
      where("title", "==", folderName),
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const folderDoc = querySnapshot.docs[0];
      await deleteDoc(folderDoc.ref);
      state(false);
    }
  } catch (e) {
    console.error(e);
  }
};
