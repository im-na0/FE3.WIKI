import React from "react";
import "../styles/Project.css";
import ProjectSider from "../components/project/ProjectSider";
import { Layout } from "antd";
import ProjectDetailInfo from "../components/project/ProjectDetailInfo";
import ProjectListSider from "../components/project/ProjectListSider";
import { useQueryProject } from "../hooks/project/useQueryProject";
import ProjectDetailDefault from "../components/project/ProjectDetailDefault";

const { Content, Sider } = Layout;

const ProjectDetail = ({ isDefault }: { isDefault: boolean }) => {
  const [projectDetail, isLoaded] = useQueryProject();

  console.log(isLoaded);
  return (
    <Layout>
      <ProjectSider />
      <Layout>
        <Sider theme="light" width={260}>
          <ProjectListSider />
        </Sider>
        <Content
          className="project__content-area"
          style={{
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#f5f5f5",
            padding: "10px",
          }}
        >
          {isDefault ? (
            <ProjectDetailDefault />
          ) : isLoaded ? (
            <ProjectDetailInfo projectDetail={projectDetail} />
          ) : null}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectDetail;
