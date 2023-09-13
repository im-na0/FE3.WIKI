import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

// styles
import styled from "styled-components";
import {
  FolderOutlined,
  FileOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";

// firebase
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  addDoc,
  updateDoc,
} from "firebase/firestore";

interface NewFile {
  name: string;
  subName: string;
}

const Nav = () => {
  const [folders, setFolders] = useState<DocumentData[]>([]);
  const [files, setFiles] = useState<DocumentData[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [inputState, setInputState] = useState<boolean>(false);
  const [newFolder, setNewFolder] = useState<string>("");
  const [fileState, setFileState] = useState<boolean>(false);
  const [newFile, setNewFile] = useState<NewFile>({ name: "", subName: "" });

  useEffect(() => {
    refreshFolders();
  }, []);

  const refreshFolders = async () => {
    const q = query(collection(db, "WikiPage"));
    const querySnapshot = await getDocs(q);
    const folderData = querySnapshot.docs.map((doc) => doc.data());
    setFolders(folderData);
  };

  const refreshFiles = async (folderId: string) => {
    const q = query(collection(db, "WikiPage"), where("title", "==", folderId));
    const querySnapshot = await getDocs(q);
    const fileData = querySnapshot.docs.map((doc) => doc.data().items);
    setFiles(fileData);
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
    refreshFiles(folderId);
  };

  const addFolder = async () => {
    await addDoc(collection(db, "WikiPage"), {
      title: newFolder,
      items: [],
    });
    refreshFolders();
  };

  const addFile = async (folderId: string) => {
    try {
      const q = query(
        collection(db, "WikiPage"),
        where("title", "==", currentFolder),
      );
      const querySnapshot = await getDocs(q);
      const folderDoc = querySnapshot.docs[0];
      const exist = folderDoc.data().items;

      const newFileData = {
        name: newFile.name,
        subName: newFile.subName,
      };

      exist.push(newFileData);

      await updateDoc(folderDoc.ref, {
        items: exist,
      });

      refreshFiles(folderId);
    } catch (e) {
      console.log(e);
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
    setNewFile({ name: e.target.value, subName: "" });
  };

  return (
    <StyledContainer>
      <StyledDiv>
        <StyledH1>Wiki</StyledH1>
        {inputState ? (
          <form onSubmit={onSubmitFolder}>
            <input
              placeholder="폴더명을 입력하세요."
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
      <StlyedUl>
        {folders.map((folder: any, index: number) => (
          <li
            key={folder.title + index}
            onClick={() => handleFolderClick(folder.title)}
          >
            <StyledTitle>
              <div>
                <FolderOutlined />
                <StyledSpan>{folder.title}</StyledSpan>
              </div>
              <button onClick={() => setFileState(true)}>+</button>
            </StyledTitle>
            {folder.title === currentFolder && (
              <>
                {fileState ? (
                  <FormContainer>
                    <FileOutlined />
                    <FileForm onSubmit={onSubmitFile}>
                      <input
                        placeholder="파일명을 입력하세요."
                        onChange={onChangeFile}
                      />
                    </FileForm>
                  </FormContainer>
                ) : null}
                <StyledFile>
                  {files.map((file, index) =>
                    file.map((v: any) => (
                      <>
                        <StyledItem key={v.name + index}>
                          <div>
                            <FileOutlined />
                            <StyledSpan>{v.name}</StyledSpan>
                          </div>
                        </StyledItem>
                      </>
                    )),
                  )}
                </StyledFile>
              </>
            )}
          </li>
        ))}
      </StlyedUl>
    </StyledContainer>
  );
};

export default Nav;

const StyledContainer = styled.div`
  margin: 0;
  padding: 0;
  padding-right: 15px;
  margin-right: 30px;
  width: 280px;
  background-color: rgba(0, 0, 0, 0.03);
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

const StlyedUl = styled.ul`
  list-style: none;
  height: 80%;
  margin: 0;
  padding: 0;
  width: 100%;
  padding-left: 15px;
  cursor: pointer;
`;
const StyledTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  padding: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    all: unset;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.5);
  }
`;
const StyledSpan = styled.span`
  margin-left: 10px;
`;
const StyledFile = styled.ul`
  list-style: none;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: 600;
  padding-left: 30px;
`;
const StyledItem = styled.li`
  padding: 3px;
  margin-bottom: 6px;
  font-size: 15px;
  &:hover {
    color: blue;
    transition: all 1s;
  }
`;
const FormContainer = styled.div`
  display: flex;
  margin: 10px 0;
  margin-left: 33px;
`;
const FileForm = styled.form`
  margin-left: 10px;
  input {
    all: unset;
    border: none;
  }
`;
