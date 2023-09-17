import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

// Style
import styled from "styled-components";
import {
  FolderOutlined,
  FileOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { Input } from "antd";

// Recoil
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentFolderTitle,
  currentFileTitle,
  totalItems,
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

const WikiNav = () => {
  const [items, setItems] = useRecoilState(totalItems);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const setCurrentTarget = useSetRecoilState(currentFolderTitle);
  const [currentTargetFile, setCurrentTargetFile] =
    useRecoilState(currentFileTitle);

  const [inputState, setInputState] = useState<boolean>(false);
  const [newFolder, setNewFolder] = useState<string>("");
  const [fileState, setFileState] = useState<boolean>(false);

  const [newFile, setNewFile] = useState<NewFile>({
    name: "",
    subName: "",
  });

  useEffect(() => {
    refreshFolders();
  }, []);

  useEffect(() => {
    refreshFolders();
  }, [currentTargetFile]);

  const refreshFolders = async () => {
    const q = query(collection(db, "WikiPage"));
    const querySnapshot = await getDocs(q);
    const folderData = querySnapshot.docs.map((doc) => doc.data() as IWiki);
    setItems(folderData);
  };

  const handleFolderClick = (current: string) => {
    if (!fileState) {
      setCurrentFolder((prev) => (prev === current ? null : current));
      if (currentFolder) setCurrentTarget(currentFolder);
    }
  };

  const handleFileClick = (current: string) => {
    setCurrentTargetFile(current);
  };

  const addFolder = async () => {
    await addDoc(collection(db, "WikiPage"), {
      title: newFolder,
      items: [],
    });
    refreshFolders();
  };

  const addFile = async (current: string) => {
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

  return (
    <StyledContainer>
      <StyledDiv>
        <StyledH1>Wiki</StyledH1>
        {inputState ? (
          <form onSubmit={onSubmitFolder}>
            <Input
              placeholder="새로운 폴더를 만들어보세요."
              value={newFolder}
              onChange={onChangeFolder}
            />
          </form>
        ) : (
          <FolderAddOutlined
            style={{ fontSize: "20px", color: "#08c", cursor: "pointer" }}
            onClick={() => {
              setInputState(true);
            }}
          />
        )}
      </StyledDiv>
      <StyledUl>
        {items.map((item, index: number) => (
          <li
            key={item.title + index}
            onClick={() => handleFolderClick(item.title)}
          >
            <StyledTitle>
              <div>
                <FolderOutlined />
                <StyledSpan>{item.title}</StyledSpan>
              </div>
              <button onClick={() => setFileState((prevState) => !prevState)}>
                {fileState ? "Cancel" : "New File"}
              </button>
            </StyledTitle>
            <StyledFile isopen={item.title === currentFolder}>
              {fileState ? (
                <FormContainer>
                  <FileOutlined style={{ fontSize: "20px" }} />
                  <FileForm onSubmit={onSubmitFile}>
                    <Input
                      placeholder="새로운 파일을 만들어보세요."
                      onChange={onChangeFile}
                    />
                  </FileForm>
                </FormContainer>
              ) : null}
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
        ))}
      </StyledUl>
    </StyledContainer>
  );
};

export default WikiNav;

const StyledContainer = styled.div`
  margin: 0;
  padding: 0;
  padding-right: 15px;
  margin-right: 30px;
  width: 400px;
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: 15px;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-left: 15px;
  margin-bottom: 15px;
`;

const StyledH1 = styled.h1`
  color: rgba(0, 0, 0, 0.5);
  font-size: 15px;
`;

const StyledUl = styled.ul`
  list-style: none;
  height: 80%;
  margin: 0;
  padding: 0;
  width: 100%;
  padding-left: 15px;
  cursor: pointer;
`;

const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  padding: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  button {
    all: unset;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.5);
    position: absolute;
    right: 0;
    z-index: 3;
    transition: font-size 0.3s;
    &:hover {
      font-size: 13px;
    }
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
    transition: background-color 0.3s;
  }
`;

const StyledSpan = styled.span`
  margin-left: 10px;
`;

const StyledFile = styled.ul<{ isopen: boolean }>`
  list-style: none;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: 500;
  padding-left: 33px;
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
  padding: 3px;
  margin-bottom: 10px;
  font-size: 15px;
  &:hover {
    color: blue;
    transition: all 1s;
  }
`;

const FormContainer = styled.div`
  display: flex;
  margin: 10px 0;
  margin-left: 0px;
`;

const FileForm = styled.form`
  margin-left: 7px;
  input {
    all: unset;
    border: none;
  }
`;
