import React from "react";
import "../styles/Project.css";
import ProjectSider from "../components/project/ProjectSider";
// import { Layout, theme } from "antd";
import { Layout } from "antd";
import ProjectNewForm from "../components/project/ProjectNewForm";

const ProjectNew = ({ isEdit }: { isEdit: boolean }) => {
  // const {
  //   token: { colorBgContainer, colorPrimary },
  // } = theme.useToken();
  return (
    <Layout>
      <ProjectSider />
      <ProjectNewForm isEdit={isEdit} />
    </Layout>
  );
};

export default ProjectNew;
