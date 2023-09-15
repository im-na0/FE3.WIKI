import React from "react";
import "../styles/Project.css";
import ProjectSider from "../components/project/ProjectSider";
// import { Layout, theme } from "antd";
import { Layout } from "antd";
import ProjectNewForm from "../components/project/ProjectNewForm";
import { useQueryProject } from "../hooks/project/useQueryProject";
import { isLoadingState } from "../store/project";
import { useRecoilValue } from "recoil";

const ProjectEdit = ({ isEdit }: { isEdit: boolean }) => {
  // const {
  //   token: { colorBgContainer, colorPrimary },
  // } = theme.useToken();
  const isLoading = useRecoilValue(isLoadingState);
  const projectDetail = useQueryProject();
  return (
    <>
      {isLoading ? null : (
        <Layout>
          <ProjectSider />
          {projectDetail !== undefined && (
            <ProjectNewForm isEdit={isEdit} projectDetail={projectDetail} />
          )}
        </Layout>
      )}
    </>
  );
};

export default ProjectEdit;
