import React from "react";
import { Button } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import ProjectMdViewer from "./ProjectMdViewer";
import ProjectDate from "./ProjectDate";
import ProjectAssignee from "./ProjectAssignee";
import { useRecoilState } from "recoil";
import { projectDetailState } from "../../store/project";

const ProjectDetailInfo = () => {
  const [projectDetail] = useRecoilState(projectDetailState);
  return (
    <div className="project-container">
      <div className="project__top-title">
        <h3>프로젝트 상세 정보</h3>
        <div className="project__top-btns">
          <Button type="primary" icon={<EditFilled />} size="large">
            프로젝트 수정
          </Button>
          <Button danger icon={<DeleteFilled />} size="large">
            프로젝트 삭제
          </Button>
        </div>
      </div>
      <h2>{projectDetail.title}</h2>
      <ProjectDate duration={projectDetail.duration} />
      <ProjectAssignee assignees={projectDetail.assignees} />
      <ProjectMdViewer />
    </div>
  );
};

export default ProjectDetailInfo;
