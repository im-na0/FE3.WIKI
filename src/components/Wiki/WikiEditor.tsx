import React, { useEffect, useRef } from "react";
import { Editor as ToastUIEditor } from "@toast-ui/react-editor";

import "@toast-ui/editor/dist/toastui-editor.css";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFolderTitle,
  currentFileTitle,
  currentItem,
} from "../../store/wiki";

import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { IItems } from "../../store/wiki";

const WikiEditor = () => {
  const editorRef = useRef<ToastUIEditor | null>(null);
  const currentFolder = useRecoilValue(currentFolderTitle);
  const currentFile = useRecoilValue(currentFileTitle);
  const [item, setItem] = useRecoilState(currentItem);

  const INIT = "마크다운 문법을 입력해보세요.";

  const postText = async (newData: string) => {
    const q = query(
      collection(db, "WikiPage"),
      where("title", "==", currentFolder),
    );
    const querySnapshot = await getDocs(q);
    const FolderDoc = querySnapshot.docs[0];

    const items = FolderDoc.data().items;
    const itemIndex = items.findIndex(
      (item: IItems) => item.name === currentFile,
    );

    if (itemIndex !== -1) {
      items[itemIndex].subName = newData;

      const data = {
        items: items,
      };

      await updateDoc(FolderDoc.ref, data);
      setItem(items[itemIndex]);
    }
  };

  useEffect(() => {
    console.log("Post 완료");
  }, [item]);

  const handleClickReg = () => {
    const newData = editorRef.current?.getInstance().getHTML();
    if (newData !== undefined) {
      postText(newData);
    }
  };

  return (
    <>
      <ToastUIEditor
        ref={editorRef}
        initialValue={INIT}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        useCommandShortcut={false}
      />
      <button onClick={handleClickReg}>등록</button>
    </>
  );
};

export default WikiEditor;
