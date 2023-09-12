import React from "react";
import "../styles/Project.css";
import ProjectSider from "../components/project/ProjectSider";
import { Layout } from "antd";
import ProjectDragDrop from "../components/project/ProjectDragDrop";

const Project = () => {
  return (
    <Layout style={{ margin: "0 -24px" }}>
      <ProjectSider />
      <div className="drag-drop-area">
        <h2>프로젝트</h2>
        <h3>프론트엔드 개발팀 Project</h3>
        <ProjectDragDrop />
        <h3>백엔드 개발팀 Project</h3>
        <ProjectDragDrop />
      </div>
    </Layout>
  );
};

export default Project;
