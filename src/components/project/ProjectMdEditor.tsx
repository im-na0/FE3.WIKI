import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

const ProjectMdEditor = () => {
  const editorRef = useRef(null);
  return (
    <Editor
      initialValue="프로젝트 설명을 입력 해주세요."
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
      ref={editorRef}
    />
  );
};

export default ProjectMdEditor;
