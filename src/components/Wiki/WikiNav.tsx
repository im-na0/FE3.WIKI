import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

// Components
import WikiSelect from "./WikiSelect";
import WikiTeamNav from "./WikiTeamNav";

// Style
import styled from "styled-components";
import {
  FolderOutlined,
  FileOutlined,
  FolderAddOutlined,
  TeamOutlined,
  LockOutlined,
  UnlockOutlined,
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
  SelectState,
} from "../../store/wiki";

// Firebase
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  setDoc,
  getDocs,
  updateDoc,
  orderBy,
} from "firebase/firestore";

// api
import { addFile, addAllFolder } from "../../hooks/Wiki/api";

// Interface
import { IWiki } from "../../store/wiki";

// React-Beautiful-Dnd
import { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface NewFile {
  name: string;
  subName: string;
}

interface isOpenProps {
  isopen: boolean;
}

const WikiNav = () => {
  const [newFolder, setNewFolder] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const [newFile, setNewFile] = useState<NewFile>({
    name: "",
    subName: "",
  });
  const [inputState, setInputState] = useState<boolean>(false);
  const [isWikiSelectOpen, setIsWikiSelectOpen] = useRecoilState(SelectState);
  const [items, setItems] = useRecoilState(totalItems);
  const [currentFolder, setCurrentFolder] = useRecoilState(SelectProps);
  const [currentTargetFile, setCurrentTargetFile] =
    useRecoilState(currentFileTitle);
  const [fileState, setFileState] = useRecoilState(newFileState);
  const [folderState, setFolderState] = useRecoilState(editFolderState);
  const setCurrentTarget = useSetRecoilState(currentFolderTitle);
  const deleteState = useRecoilValue(deleteFolderState);
  const [teamName, setTeamName] = useState<string | null>(null);

  const refreshFolders = async () => {
    const q = query(
      collection(db, "WikiPage"),
      orderBy("order"),
      where("teamName", "==", null),
    );
    const querySnapshot = await getDocs(q);
    const folderData = querySnapshot.docs.map((doc) => doc.data() as IWiki);
    setItems(folderData);
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
    addAllFolder(newFolder, refreshFolders);
    setInputState(false);
    setNewFolder("");
  };

  const onChangeFolder = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFolder(e.target.value);
  };

  const onSubmitFile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFolder) addFile(currentFolder, newFile, refreshFolders);
    setFileState(false);
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFile({ ...newFile, name: e.target.value });
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

  const handleLiClick = (item: string) => {
    if (!isWikiSelectOpen) {
      handleFolderClick(item);
    }
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

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const itemsCopy = [...items];
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    setItems(itemsCopy);

    const foldersRef = collection(db, "WikiPage");
    const querySnapshot = await getDocs(query(foldersRef, orderBy("order")));

    const newItems = itemsCopy.map((item, index) => ({
      ...item,
      order: index,
    }));

    const batch: Promise<void>[] = [];

    querySnapshot.forEach((doc) => {
      const newItem = newItems.find((item) => item.title === doc.data().title);
      if (newItem) {
        batch.push(setDoc(doc.ref, newItem));
      }
    });

    await Promise.all(batch);
  };

  // 유저 검증 및 팀 확인
  const userUid = localStorage.getItem("uid");

  const validTeamUser = async () => {
    const q = query(
      collection(db, "Teams"),
      where("userId", "array-contains", userUid),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const teamName = querySnapshot.docs[0].data().teamName;
      setTeamName(teamName);
    }
  };

  useEffect(() => {
    refreshFolders();
    validTeamUser();
  }, []);

  useEffect(() => {
    refreshFolders();
    validTeamUser();
  }, [currentTargetFile, deleteState, userUid]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="folders">
        {(provided) => (
          <Container>
            <StyledContainer>
              <FolderWrapper>
                <TeamOutlined />
                <StyledFolderTitle>전체</StyledFolderTitle>
              </FolderWrapper>
              <StyledDiv>
                <StyledForm
                  onClick={() => {
                    setInputState((prev) => !prev);
                  }}
                >
                  <FolderAddOutlined
                    style={{ color: "white", fontSize: "15px" }}
                  />
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
              <StyledUl {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index: number) => (
                  <Draggable
                    key={item.title}
                    draggableId={item.title + index}
                    index={index}
                  >
                    {(provided) => (
                      <div key={item.title + index}>
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleLiClick(item.title)}
                        >
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
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </StyledUl>
            </StyledContainer>
            <StyledTeamContainer>
              <FolderWrapper>
                {userUid ? <UnlockOutlined /> : <LockOutlined />}
                <StyledFolderTitle>
                  <span>팀 &nbsp;&nbsp;</span>
                  {userUid ? (
                    <span>{teamName}</span>
                  ) : (
                    <span>로그인을 해주세요</span>
                  )}
                </StyledFolderTitle>
              </FolderWrapper>
              <FolderAddOutlined style={{ color: "white", fontSize: "15px" }} />
            </StyledTeamContainer>
            {teamName !== null && <WikiTeamNav teamName={teamName} />}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default WikiNav;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledContainer = styled.div`
  margin: 0;
  padding: 0;
  margin-right: 30px;
  margin-bottom: 30px;
  width: 280px;
  background-color: rgba(0, 0, 0, 0.01);
  border-right: 0.1px solid rgba(0, 0, 0, 0.1);
`;

const FolderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-top: 3px;
  margin-bottom: 8px;
  color: black;
  opacity: 0.7;
  padding-bottom: 5px;
`;

const StyledFolderTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  padding-left: 5px;
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
  margin-top: 3px;
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

const StyledTeamContainer = styled.div`
  margin-right: 30px;
  width: 280px;
  background-color: rgba(0, 0, 0, 0.01);
  border-right: 0.1px solid rgba(0, 0, 0, 0.1);
`;
