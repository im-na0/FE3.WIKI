import React from "react";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/react-editor";

const ProjectMdViewer = () => {
  const contents =
    "## 프로젝트 설명.  \n Lorem ipsum dolor sit amet, consectetur adipisicing elit. \n ### 프로젝트 상세 설명 \n Voluptate sed odit molestiae itaque ipsa enim vel non deleniti, ratione, ducimus inventore molestias odio nostrum atque vitae earum nesciunt? Minus, deleniti.";

  return <Viewer initialValue={contents} />;
};

export default ProjectMdViewer;
