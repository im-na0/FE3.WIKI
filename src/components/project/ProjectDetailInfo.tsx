import React from "react";
import { Button } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import ProjectMdViewer from "./ProjectMdViewer";
import ProjectDate from "./ProjectDate";
import ProjectAssignee from "./ProjectAssignee";

const ProjectDetailInfo = () => {
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
      <h2>OO전자 토이 프로젝트 생성</h2>
      <ProjectDate duration={"2023.09.10 ~ 2023.09.20"} />
      <ProjectAssignee assignees={["김OO", "이XX"]} />
      <ProjectMdViewer />
    </div>
  );
};

export default ProjectDetailInfo;
