import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { EllipsisOutlined } from "@ant-design/icons";

// Firebase
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// Recoil
import { useSetRecoilState } from "recoil";
import {
  newFileState,
  editFolderState,
  deleteFolderState,
  SelectProps,
} from "../../store/wiki";

interface CustomSelectMenuProps {
  visible: boolean;
}

interface IProps {
  title: string;
}

function WikiSelect({ title }: IProps) {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const setFileState = useSetRecoilState(newFileState);
  const setFolderState = useSetRecoilState(editFolderState);
  const setDeleteFolderState = useSetRecoilState(deleteFolderState);
  const setCurrentFolder = useSetRecoilState(SelectProps);

  const handleButtonClick = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleItemClick = (item: string) => {
    setMenuVisible(false);
  };

  const deleteFolder = async (folderName: string) => {
    try {
      const q = query(
        collection(db, "WikiPage"),
        where("title", "==", folderName),
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const folderDoc = querySnapshot.docs[0];
        await deleteDoc(folderDoc.ref);
        setDeleteFolderState(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("Initialize");
  }, [deleteFolderState]);

  return (
    <Container>
      <EllipsisOutlined onClick={handleButtonClick} />
      <CustomSelectMenu visible={isMenuVisible}>
        <CustomSelectItem
          onClick={() => {
            handleItemClick(title);
            setCurrentFolder(title);
            setFolderState((prev) => !prev);
            setCurrentFolder(title);
          }}
        >
          폴더 이름 변경
        </CustomSelectItem>
        <CustomSelectItem
          onClick={() => {
            handleItemClick(title);
            setDeleteFolderState(true);
            deleteFolder(title);
          }}
        >
          폴더 삭제
        </CustomSelectItem>
        <CustomSelectItem
          onClick={() => {
            handleItemClick(title);
            setFileState((prev) => !prev);
            setCurrentFolder(title);
          }}
        >
          새로운 파일
        </CustomSelectItem>
      </CustomSelectMenu>
    </Container>
  );
}

export default WikiSelect;

const Container = styled.div`
  position: relative;
`;

const CustomSelectMenu = styled.ul<CustomSelectMenuProps>`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  z-index: 999;
  width: 120px;
  padding: 0;
  margin: 0;
  margin-left: 8px;
`;

const CustomSelectItem = styled.li`
  padding: 5px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
  font-size: 13px;
`;
