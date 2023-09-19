import React, { useEffect } from "react";

// Components
import WikiEditor from "./WikiEditor";
import WikiViewer from "./WikiViewer";

// Style
import styled from "styled-components";

// Recoil
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFolderTitle,
  currentFileTitle,
  currentItem,
} from "../../store/wiki";

// Interface
import { IWiki } from "../../store/wiki";

// Firebase
import { db } from "../../libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

export interface IItem {
  name: string;
  subName: string;
  date?: Timestamp;
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
      const q = query(collection(db, "WikiPage"));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.map((doc) => doc.data() as IWiki);
    } else {
      const items = FolderDoc.data().items || [];
      const item = await items.find((item: IItem) => item.name === currentFile);
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
      <div>
        {item && (
          <>
            {item.subName === "" ? (
              <WikiEditor />
            ) : (
              <WikiViewer content={item} />
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default SubPage;

const Container = styled.div`
  span {
    opacity: 0.4;
    font-size: 0.85rem;
  }
`;
