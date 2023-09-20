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
import { Button, Space, Input, Avatar } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";

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
  const { fileName, subName, date, name, position, department } = content;

  const prevSubNameRef = useRef<string | null>(null);
  const prevNameRef = useRef<string | null>(null);

  const [renderKey, setRenderKey] = useState(0);
  const [editState, setEditState] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(fileName);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

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
      (item: IItems) => item.fileName === currentFile,
    );

    if (itemIndex !== -1) {
      items[itemIndex].fileName = newData;

      const data = {
        items: items,
      };

      await updateDoc(FolderDoc.ref, data);

      setItem(items[itemIndex]);
      setCurrentFile(newData);
    }
  };

  // 삭제 권한(position === "Manager")일 경우 부여 => 임시 해제(테스트용)
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
        (item: IItems) => item.fileName === currentFile,
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
    if (prevNameRef.current !== fileName) {
      prevNameRef.current = fileName;
      setRenderKey((prev) => prev + 1);
    }
  }, [subName, fileName]);

  useEffect(() => {
    console.log("editFile 현재: ", editFile);
  }, [editFile, editFileState]);

  useEffect(() => {
    if (date) {
      const year = date.toDate().getFullYear();
      const month = date.toDate().getMonth() + 1;
      const day = date.toDate().getDate();
      const hours = date.toDate().getHours();
      const minutes = date.toDate().getMinutes();

      const formatDate = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
      setFormattedDate(formatDate);

      if (name) {
        const formatUserDate = `${month}월 ${day}일`;
        setFormattedDate(formatUserDate);
      }
    }
  }, [date]);

  return (
    <Container>
      {editFile === false ? (
        <>
          <StyledDiv>
            <div>
              {!editState ? (
                <>
                  <h1>{fileName}</h1>
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
                  <Input placeholder={fileName} onChange={onChangeEdit} />
                </form>
              )}
            </div>
            <Space wrap>
              <Button onClick={onClickSubEdit}>수정</Button>
              <Button onClick={postDelete}>삭제</Button>
            </Space>
          </StyledDiv>
          {name ? (
            <UserContainer>
              <Space wrap size={16} style={{ marginRight: "14px" }}>
                <Avatar size={38} icon={<UserOutlined />} />
              </Space>
              <div>
                <div style={{ fontWeight: "600" }}>{name}</div>
                <StyledSpan>
                  <span>{department} - </span>
                  <span>{position} • </span>
                  <span>{formattedDate}</span>
                </StyledSpan>
              </div>
            </UserContainer>
          ) : (
            <StyledDate>최종 수정일 : {formattedDate}</StyledDate>
          )}

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
  margin-top: -20px;
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
    margin-top: 10px;
    margin-bottom: 20px;
  }
`;
const StyledViewer = styled.div`
  font-size: 1rem !important;
  margin-top: 30px;
`;
const StyledDate = styled.div`
  opacity: 0.5;
  font-size: 0.75rem;
  margin-top: -10px;
  margin-bottom: 30px;
`;
const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;
const StyledSpan = styled.div`
  margin-top: 3px;
  span {
    font-size: 12px;
  }
`;
