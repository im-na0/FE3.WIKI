import React from "react";
import "../styles/Project.css";
import ProjectSider from "../components/project/ProjectSider";
import { Layout } from "antd";
import ProjectDetailInfo from "../components/project/ProjectDetailInfo";
import ProjectListSider from "../components/project/ProjectListSider";
import { useRecoilValue } from "recoil";
import { useQueryProject } from "../hooks/project/useQueryProject";
import { isLoadingState } from "../store/project";
// import ProjectNewForm from "../components/project/ProjectNewForm";

const { Content, Sider } = Layout;

const ProjectList = () => {
  // const [isModifying, setIsModifying] = useState(false);
  const isLoading = useRecoilValue(isLoadingState);
  const projectDetail = useQueryProject();

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
          {!isLoading && projectDetail !== undefined && (
            <ProjectDetailInfo
              isLoading={isLoading}
              projectDetail={projectDetail}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectList;
