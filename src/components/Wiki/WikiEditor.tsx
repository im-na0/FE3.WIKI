import React, { useEffect, useRef } from "react";

// Toast UI Editor
import { Editor as ToastUIEditor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

// Style
import styled from "styled-components";
import { Button, Space } from "antd";

// Recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentFolderTitle,
  currentFileTitle,
  currentItem,
  editFileState,
  editFileSubName,
} from "../../store/wiki";

// Firebase
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { storage } from "../../libs/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Interface
import { IItems } from "../../store/wiki";

const WikiEditor = () => {
  const editorRef = useRef<ToastUIEditor | null>(null);
  const currentFolder = useRecoilValue(currentFolderTitle);
  const currentFile = useRecoilValue(currentFileTitle);
  const [item, setItem] = useRecoilState(currentItem);
  const setEditFile = useSetRecoilState(editFileState);
  const [existSub, setExistSub] = useRecoilState(editFileSubName);

  const INIT = "마크다운 문법을 입력해보세요...";

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

  const handleClickReg = () => {
    if (existSub) {
      const changeData = editorRef.current?.getInstance().getMarkdown();
      if (changeData !== undefined) {
        postText(changeData);
        setEditFile(false);
      }
      setExistSub("");
    } else {
      const newData = editorRef.current?.getInstance().getMarkdown();
      if (newData !== undefined) {
        console.log(3.1);
        postText(newData);
        setEditFile(false);
      }
    }
  };

  useEffect(() => {
    console.log("Wiki Editor 등록 완료");
  }, [item]);

  useEffect(() => {
    console.log(1);
  }, []);

  const onUploadImage = async (
    blob: Blob | File,
    callback: (url: string, text?: string) => void,
  ): Promise<void> => {
    if (blob instanceof File) {
      try {
        const lastIndex = blob.name.lastIndexOf(".");
        const fileName = blob.name.substring(0, lastIndex);
        const ext = blob.name.substring(lastIndex);
        const fullFileName = fileName + "-" + new Date().getTime() + ext;

        const storageRef = ref(storage, `wiki/${fullFileName}`);
        const uploadRef = await uploadBytes(storageRef, blob).then(
          (snapshot) => snapshot.ref,
        );
        const url = await getDownloadURL(uploadRef);
        callback(url, blob?.name);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container>
      <StyledTop>
        <h1>{currentFile}</h1>
        <Space wrap>
          <Button onClick={handleClickReg}>등록</Button>
        </Space>
      </StyledTop>
      <ToastUIEditor
        ref={editorRef}
        initialValue={existSub ? existSub : INIT}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        useCommandShortcut={false}
        hooks={{ addImageBlobHook: onUploadImage }}
      />
    </Container>
  );
};

export default WikiEditor;

const Container = styled.div`
  width: 95%;
`;

const StyledTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
