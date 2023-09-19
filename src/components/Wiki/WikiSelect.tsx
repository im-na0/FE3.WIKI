import React, { useEffect, useState } from "react";

// Style
import styled from "styled-components";
import { EllipsisOutlined } from "@ant-design/icons";

// Recoil
import { useSetRecoilState } from "recoil";
import {
  newFileState,
  editFolderState,
  deleteFolderState,
  SelectProps,
} from "../../store/wiki";

// api
import { deleteFolder } from "../../hooks/Wiki/api";

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
            deleteFolder(title, setDeleteFolderState);
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
