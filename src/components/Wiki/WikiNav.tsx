import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import WikiSelect from "./WikiSelect";

// Style
import styled from "styled-components";
import {
  FolderOutlined,
  FileOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { Input } from "antd";

// Recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import {
  currentFolderTitle,
  currentFileTitle,
  totalItems,
  newFileState,
  editFolderState,
  deleteFolderState,
  SelectProps,
} from "../../store/wiki";

// Firebase
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";

// Interface
import { IWiki } from "../../store/wiki";

interface NewFile {
  name: string;
  subName: string;
}

interface isOpenProps {
  isopen: boolean;
}

const WikiNav = () => {
  const [items, setItems] = useRecoilState(totalItems);
  const [currentFolder, setCurrentFolder] = useRecoilState(SelectProps);
  const setCurrentTarget = useSetRecoilState(currentFolderTitle);
  const [currentTargetFile, setCurrentTargetFile] =
    useRecoilState(currentFileTitle);
  const [inputState, setInputState] = useState<boolean>(false);
  const [newFolder, setNewFolder] = useState<string>("");
  const [fileState, setFileState] = useRecoilState(newFileState);
  const [newFile, setNewFile] = useState<NewFile>({
    name: "",
    subName: "",
  });
  const [isWikiSelectOpen, setIsWikiSelectOpen] = useState(false);
  const [folderState, setFolderState] = useRecoilState(editFolderState);
  const [folderName, setFolderName] = useState<string>("");
  const deleteState = useRecoilValue(deleteFolderState);

  useEffect(() => {
    refreshFolders();
  }, []);

  useEffect(() => {
    refreshFolders();
  }, [currentTargetFile, deleteState]);

  const refreshFolders = async () => {
    const q = query(collection(db, "WikiPage"));
    const querySnapshot = await getDocs(q);
    const folderData = querySnapshot.docs.map((doc) => doc.data() as IWiki);
    setItems(folderData);
  };

  const addFolder = async () => {
    if (newFolder.length > 0) {
      await addDoc(collection(db, "WikiPage"), {
        title: newFolder,
        items: [],
      });
      refreshFolders();
    }
  };

  const addFile = async (current: string) => {
    console.log(currentFolder);
    try {
      const q = query(
        collection(db, "WikiPage"),
        where("title", "==", current),
      );
      const querySnapshot = await getDocs(q);
      const folderDoc = querySnapshot.docs[0];
      const exist = folderDoc.data().items;
      const date = new Date();
      const newFileData = {
        name: newFile.name,
        subName: newFile.subName,
        date: date,
      };
      exist.push(newFileData);
      await updateDoc(folderDoc.ref, {
        items: exist,
      });

      refreshFolders();
    } catch (e) {
      console.error(e);
    }
  };

  const changeFolderName = async (
    currentFolderName: string,
    newFolderName: string,
  ) => {
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
      refreshFolders();
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitFolder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addFolder();
    setInputState(false);
  };

  const onChangeFolder = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFolder(e.target.value);
  };

  const onSubmitFile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFolder) addFile(currentFolder);
    setFileState(false);
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFile({ ...newFile, name: e.target.value });
  };

  const handleLiClick = (item: string) => {
    if (!isWikiSelectOpen) {
      handleFolderClick(item);
    }
  };

  const handleFolderClick = (current: string) => {
    if (!fileState) {
      setCurrentFolder((prev) => (prev === current ? null : current));
      if (currentFolder) setCurrentTarget(currentFolder);
    }
  };

  const handleFileClick = (current: string) => {
    setCurrentTargetFile(current);
    setFileState(false);
  };

  const handleWikiSelectToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWikiSelectOpen((prev) => !prev);
  };

  const onSubmitFolderName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFolder && folderName.trim() !== "") {
      changeFolderName(currentFolder, folderName);
      setFolderState(false);
    }
  };

  const onChangeFolderName = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };

  return (
    <StyledContainer>
      <StyledDiv>
        <StyledForm
          onClick={() => {
            setInputState((prev) => !prev);
          }}
        >
          <FolderAddOutlined style={{ color: "white", fontSize: "15px" }} />
          <FormSpan>새 폴더 추가</FormSpan>
        </StyledForm>
        {inputState && (
          <NewFolderContainer>
            <form onSubmit={onSubmitFolder}>
              <Input
                placeholder="새 폴더명을 입력해주세요"
                value={newFolder}
                onChange={onChangeFolder}
                style={{
                  padding: "6.5px",
                  borderRadius: "0",
                  border: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  paddingLeft: "25px",
                }}
              />
            </form>
          </NewFolderContainer>
        )}
      </StyledDiv>

      <StyledUl>
        {items.map((item, index: number) => (
          <ItemContainer key={item.title + index}>
            <li onClick={() => handleLiClick(item.title)}>
              <StyledTitle>
                <div>
                  {(folderState && currentFolder) === item.title ? (
                    <form onSubmit={onSubmitFolderName}>
                      <Input
                        defaultValue={item.title}
                        onChange={onChangeFolderName}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </form>
                  ) : (
                    <>
                      <FolderOutlined />
                      <StyledSpan>{item.title}</StyledSpan>
                    </>
                  )}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWikiSelectToggle(e);
                  }}
                >
                  <WikiSelect title={item.title} />
                </div>
              </StyledTitle>
              <StyledFile isopen={item.title === currentFolder}>
                {fileState && (
                  <FormContainer>
                    <FileOutlined style={{ fontSize: "14px" }} />
                    <FileForm onSubmit={onSubmitFile}>
                      <Input
                        placeholder="새로운 파일"
                        onChange={onChangeFile}
                      />
                    </FileForm>
                  </FormContainer>
                )}
                {item.items &&
                  item.items.map((v, fileIndex: number) => (
                    <StyledItem
                      key={v.name + fileIndex}
                      onClick={() => handleFileClick(v.name)}
                    >
                      <div>
                        <FileOutlined />
                        <StyledSpan>{v.name}</StyledSpan>
                      </div>
                    </StyledItem>
                  ))}
              </StyledFile>
            </li>
          </ItemContainer>
        ))}
      </StyledUl>
    </StyledContainer>
  );
};

export default WikiNav;

const StyledContainer = styled.div`
  margin: 0;
  padding: 0;
  margin-right: 30px;
  width: 280px;
  background-color: rgba(0, 0, 0, 0.01);
  border-right: 0.1px solid rgba(0, 0, 0, 0.1);
`;

const StyledDiv = styled.div`
  margin-bottom: 0;
`;
const NewFolderContainer = styled.div`
  margin-top: 5px;
`;

const StyledUl = styled.ul`
  list-style: none;
  height: 80%;
  margin: 0;
  padding: 0;
  width: 100%;
  cursor: pointer;
`;

const StyledTitle = styled.div`
  margin-top: 10px;
  font-size: 14.5px;
  padding: 10px;
  padding-left: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  button {
    all: unset;
    font-size: 10.8px;
    color: rgba(0, 0, 0, 0.5);
    position: absolute;
    right: 7px;
    z-index: 3;
    transition: font-size 0.3s;
    padding-right: 3px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      transition: background-color 0.3s;
    }
`;

const StyledForm = styled.div`
  background-color: #6c63ff;
  padding: 13px;
  padding-left: 25px;
  cursor: pointer;
`;
const FormSpan = styled.span`
  margin-left: 10px;
  color: white;
  font-size: 13px;
  font-weight: 900;
`;

const StyledSpan = styled.span`
  margin-left: 6px;
  line-height: 10px;
`;

const StyledFile = styled.ul<isOpenProps>`
  list-style: none;
  cursor: pointer;
  margin-top: 3px;
  color: rgba(0, 0, 0, 0.85);
  max-height: ${(props) => (props.isopen ? "500px" : "0")};
  overflow: hidden;
  transition:
    max-height 0.3s,
    opacity 0.3s;
  div {
    opacity: ${(props) => (props.isopen ? "1" : "0")};
    transition: opacity 0.3s;
  }
`;

const StyledItem = styled.li`
  width: 85%;
  padding: 3px;
  padding-bottom: 5px;
  padding-left: 4px;
  margin-bottom: 8.5px;
  font-size: 13.8px;
  &:hover {
    color: blue;
    transition: all 1s;
  }
`;

const FormContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  margin-left: 3.6px;
`;

const FileForm = styled.form`
  margin-left: 5px;
  input {
    all: unset;
    border: none;
    font-size: 14px;
  }
`;
const ItemContainer = styled.div``;
