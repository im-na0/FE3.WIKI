import React from "react";
import "../styles/Project.css";
import ProjectSider from "../components/project/ProjectSider";
import { Layout } from "antd";
import ProjectDragDrop from "../components/project/ProjectDragDrop";

const Project = () => {
  return (
    <Layout>
      <ProjectSider />
      <div className="drag-drop-area">
        <div className="project__top-title">
          <h3>프로젝트</h3>
        </div>
        <h2>프론트엔드 개발팀 Project</h2>
        <ProjectDragDrop />
        <h2>백엔드 개발팀 Project</h2>
        <ProjectDragDrop />
      </div>
    </Layout>
  );
};

export default Project;
