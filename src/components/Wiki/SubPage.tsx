import React, { useEffect } from "react";
import { IWiki } from "../../store/wiki";

// styles
import styled from "styled-components";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFolderTitle,
  currentFileTitle,
  currentItem,
} from "../../store/wiki";

import WikiEditor from "./WikiEditor";
import WikiViewer from "./WikiViewer";

import { db } from "../../libs/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export interface IItem {
  name: string;
  subName: string;
}

const SubPage = () => {
  const currentFolder = useRecoilValue(currentFolderTitle);
  const currentFile = useRecoilValue(currentFileTitle);
  const [item, setItem] = useRecoilState(currentItem);

  const refreshFile = async () => {
    const q = query(
      collection(db, "WikiPage"),
      where("title", "==", currentFolder),
    );
    const querySnapshot = await getDocs(q);
    const FolderDoc = querySnapshot.docs[0];
    if (FolderDoc === undefined) {
      // 초기화면에서 전역값이 null이여서 에러 발생
      // 기본값 Fix 필요(추천하는건 첫 렌더링 때는 기본 페이지 이동 : 튜토리얼 페이지 Navigate)
      const q = query(collection(db, "WikiPage"));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.map((doc) => doc.data() as IWiki);
    } else {
      const items = FolderDoc.data().items || [];
      const item = items.find((item: IItem) => item.name === currentFile);
      setItem(item);
    }
  };

  useEffect(() => {
    refreshFile();
  }, [currentFile, currentFolder]);

  return (
    <Container>
      <span>
        {currentFolder} / {currentFile}
      </span>
      <br />
      <h1>{currentFile}</h1>
      {item && (
        <>
          {item.subName === "" ? <WikiEditor /> : <WikiViewer content={item} />}
        </>
      )}
    </Container>
  );
};

export default SubPage;

const Container = styled.div`
  margin-top: 20px;
  span {
    opacity: 0.4;
    font-size: 0.85rem;
  }
`;
