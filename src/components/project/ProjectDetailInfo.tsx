import React from "react";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Button } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import ProjectDate from "./ProjectDate";
import ProjectAssignee from "./ProjectAssignee";
import { Viewer } from "@toast-ui/react-editor";
import { useNavigate } from "react-router-dom";
import { ProjectDetail } from "../../libs/firestore";

const ProjectDetailInfo = ({
  isLoading,
  projectDetail,
}: {
  isLoading: boolean;
  projectDetail?: ProjectDetail;
}) => {
  // const isLoading = useRecoilValue(isLoadingState);
  // const projectDetail = useQueryProject();
  const navigate = useNavigate();
  // console.log(projectDetail);

  return (
    <>
      {isLoading ? null : (
        <div className="project-container">
          <div className="project__top-title">
            <h3>프로젝트 상세 정보</h3>
            <div className="project__top-btns">
              <Button
                type="primary"
                icon={<EditFilled />}
                size="large"
                onClick={() => {
                  navigate(`/project/${projectDetail?.id}/edit`);
                }}
              >
                프로젝트 수정
              </Button>
              <Button danger icon={<DeleteFilled />} size="large">
                프로젝트 삭제
              </Button>
            </div>
          </div>
          <h2>{projectDetail?.title}</h2>
          <ProjectDate duration={projectDetail?.duration} />
          <ProjectAssignee assignees={projectDetail?.assignees} />
          {projectDetail?.teams.join("")}
          <Viewer initialValue={projectDetail?.data} />
        </div>
      )}
    </>
  );
};

export default ProjectDetailInfo;
