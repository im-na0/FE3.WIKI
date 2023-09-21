import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// Components
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
  totalTeamItems,
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

// Interface
import { IWiki } from "../../store/wiki";
import { ITeamProps } from "./WikiNav";

// React-Beautiful-Dnd
import { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// api
import { addTeamFile, addTeamFolder } from "../../hooks/Wiki/api";

interface ITeamList {
  teamName: string;
  teamInfos: ITeamProps;
}

export interface TeamNewFile {
  fileName: string;
  subName: string;
}

const WikiTeamNav = ({ teamName, teamInfos }: ITeamList) => {
  const [inputState, setInputState] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const [newFolder, setNewFolder] = useState<string>("");
  const [newFile, setNewFile] = useState<TeamNewFile>({
    fileName: "",
    subName: "",
  });
  const [isWikiSelectOpen, setIsWikiSelectOpen] = useRecoilState(SelectState);
  const [items, setItems] = useRecoilState(totalTeamItems);
  const [currentFolder, setCurrentFolder] = useRecoilState(SelectProps);
  const [currentTargetFile, setCurrentTargetFile] =
    useRecoilState(currentFileTitle);
  const [fileState, setFileState] = useRecoilState(newFileState);
  const [folderState, setFolderState] = useRecoilState(editFolderState);
  const setCurrentTarget = useSetRecoilState(currentFolderTitle);
  const deleteState = useRecoilValue(deleteFolderState);

  const refreshFolders = async () => {
    const q = query(
      collection(db, "WikiPage"),
      orderBy("order"),
      where("teamName", "==", teamName),
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
    addTeamFolder(newFolder, refreshFolders, teamName);
    setInputState(false);
    setNewFolder("");
  };

  const onChangeFolder = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFolder(e.target.value);
  };

  const onSubmitFile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFolder)
      addTeamFile(
        currentFolder,
        newFile,
        teamInfos.name,
        teamInfos.department,
        teamInfos.position,
        teamInfos.photo,
        refreshFolders,
      );
    setFileState(false);
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFile({ ...newFile, fileName: e.target.value });
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

  useEffect(() => {
    console.log(teamName, "위키 활성화!");
    refreshFolders();
  }, []);

  useEffect(() => {
    refreshFolders();
  }, [currentTargetFile, deleteState, teamName]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="folders">
        {(provided) => (
          <StyledContainer>
            <StyledDiv>
              <StyledForm
                onClick={() => {
                  setInputState((prev) => !prev);
                }}
              >
                <FolderAddOutlined
                  style={{ color: "white", fontSize: "15px" }}
                />
                <FormSpan>팀 폴더 추가</FormSpan>
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
                    <ItemContainer key={item.title + index}>
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
                        <StyledFile
                          className={
                            item.title === currentFolder ? "open" : "closed"
                          }
                        >
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
                                key={v.fileName + fileIndex}
                                onClick={() => handleFileClick(v.fileName)}
                              >
                                <div>
                                  <FileOutlined />
                                  <StyledSpan>{v.fileName}</StyledSpan>
                                </div>
                              </StyledItem>
                            ))}
                        </StyledFile>
                      </li>
                    </ItemContainer>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </StyledUl>
          </StyledContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default WikiTeamNav;

const StyledContainer = styled.div`
  margin: 0;
  margin-top: -15px;
  padding: 0;
  margin-right: 30px;
  margin-bottom: 30px;
  width: 280px;
  background-color: rgba(0, 0, 0, 0.01);
  border-right: 0.1px solid rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    width: 100%;
  }
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

const StyledFile = styled.ul`
  list-style: none;
  cursor: pointer;
  margin-top: 3px;
  color: rgba(0, 0, 0, 0.85);
  &.open {
    max-height: 500px;
    div {
      opacity: 1;
    }
  }
  &.closed {
    max-height: 0;
    opacity: 0;
  }
  overflow: hidden;
  transition:
    max-height 0.3s,
    opacity 0.3s;
  div {
    transition: opacity 0.3s;
  }
`;

const StyledItem = styled.li`
  width: 85%;
  padding: 3px;
  padding-bottom: 5px;
  padding-left: 4px;
  margin-top: 3px;
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
