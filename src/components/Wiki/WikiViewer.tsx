import React, { useEffect, useRef, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

import { IItem } from "./SubPage";

import styled from "styled-components";

interface IContent {
  content: IItem;
}

const WikiViewer = ({ content }: IContent) => {
  const { subName } = content;
  const [renderKey, setRenderKey] = useState(0);
  const prevSubNameRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevSubNameRef.current !== subName) {
      prevSubNameRef.current = subName;
      setRenderKey((prev) => prev + 1);
    }
  }, [subName]);

  return (
    <Container>
      <Viewer key={renderKey} initialValue={subName} />
    </Container>
  );
};

export default WikiViewer;

const Container = styled.div``;
