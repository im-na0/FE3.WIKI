import React from "react";
import "../styles/Project.css";
import ProjectSider from "../components/project/ProjectSider";
import { Layout } from "antd";
import ProjectDetailInfo from "../components/project/ProjectDetailInfo";

const ProjectDetail = () => {
  return (
    <Layout>
      <ProjectSider />
      <ProjectDetailInfo />
    </Layout>
  );
};

export default ProjectDetail;
