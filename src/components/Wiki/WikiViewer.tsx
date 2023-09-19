import React, {
  useEffect,
  useRef,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";

// Components
import WikiEditor from "./WikiEditor";

// Toast UI Editor
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

// Style
import styled from "styled-components";
import { Button, Space, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";

// Recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentFolderTitle,
  currentFileTitle,
  currentItem,
  totalItems,
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

// Interface
import { IItem } from "./WikiSubPage";
import { IItems } from "../../store/wiki";
import { IWiki } from "../../store/wiki";

interface IContent {
  content: IItem;
}

const WikiViewer = ({ content }: IContent) => {
  const { name, subName } = content;

  const prevSubNameRef = useRef<string | null>(null);
  const prevNameRef = useRef<string | null>(null);

  const [renderKey, setRenderKey] = useState(0);
  const [editState, setEditState] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(name);

  const [currentFile, setCurrentFile] = useRecoilState(currentFileTitle);
  const [editFile, setEditFile] = useRecoilState(editFileState);
  const currentFolder = useRecoilValue(currentFolderTitle);
  const setItem = useSetRecoilState(currentItem);
  const setItems = useSetRecoilState(totalItems);
  const setExistSub = useSetRecoilState(editFileSubName);

  const postEditTitle = async (newData: string) => {
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
      items[itemIndex].name = newData;

      const data = {
        items: items,
      };

      await updateDoc(FolderDoc.ref, data);

      setItem(items[itemIndex]);
      setCurrentFile(newData);
    }
  };

  const postDelete = async () => {
    try {
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
        items.splice(itemIndex, 1); // 현재 파일을 배열에서 삭제

        const data = {
          items: items,
        };

        await updateDoc(FolderDoc.ref, data);
        setCurrentFile("");
      }
    } catch (error) {
      console.error("파일 삭제 중 오류 발생:", error);
    }
  };

  const refresh = async () => {
    const q = query(collection(db, "WikiPage"));
    const querySnapshot = await getDocs(q);
    const folderData = querySnapshot.docs.map((doc) => doc.data() as IWiki);
    setItems(folderData);
  };

  const onSubmitEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postEditTitle(editTitle);
    setEditState(false);
    refresh();
  };

  const onClickEdit = () => {
    setEditState(true);
  };

  const onChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const onClickSubEdit = () => {
    setEditFile(true);
    setExistSub(subName);
  };

  useEffect(() => {
    if (prevSubNameRef.current !== subName) {
      prevSubNameRef.current = subName;
      setRenderKey((prev) => prev + 1);
    }
    if (prevNameRef.current !== name) {
      prevNameRef.current = name;
      setRenderKey((prev) => prev + 1);
    }
  }, [subName, name]);

  useEffect(() => {
    console.log("editFile 현재: ", editFile);
  }, [editFile, editFileState]);

  useEffect(() => {
    console.log("Initialize");
  }, []);

  return (
    <Container>
      {editFile === false ? (
        <>
          <StyledDiv>
            <div>
              {!editState ? (
                <>
                  <h1>{name}</h1>
                  <EditOutlined
                    style={{
                      marginTop: "12px",
                      cursor: "pointer",
                    }}
                    onClick={onClickEdit}
                  />
                </>
              ) : (
                <form onSubmit={onSubmitEdit}>
                  <Input placeholder={name} onChange={onChangeEdit} />
                </form>
              )}
            </div>
            <Space wrap>
              <Button onClick={onClickSubEdit}>수정</Button>
              <Button onClick={postDelete}>삭제</Button>
            </Space>
          </StyledDiv>
          <StyledViewer>
            <Viewer key={renderKey} initialValue={subName} />
          </StyledViewer>
        </>
      ) : (
        <WikiEditor />
      )}
    </Container>
  );
};

export default WikiViewer;

const Container = styled.div`
  width: 95%;
`;
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    h1 {
      margin-right: 10px;
    }
  }
  form {
    margin: 5px;
  }
`;
const StyledViewer = styled.div`
  font-size: 1rem !important;
`;
