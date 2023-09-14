import React from "react";
import styled from "styled-components";
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ProjectDate from "./ProjectDate";
import ProjectAssignee from "./ProjectAssignee";
import { ProjectInfo } from "./ProjectDragDrop";

const ProjectItem = styled.div`
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #dfdfdf;
  .project__item-title {
    margin-bottom: 12px;
    font-size: 14px;
  }
`;
const ProjectStatus = styled.div<{ $status: string }>`
  padding: 6px;
  display: inline-block;
  font-size: 12px;
  margin-bottom: 7px;
  background-color: ${(props) =>
    props.$status === "progress"
      ? "lightgreen"
      : props.$status === "plus"
      ? "lightblue"
      : "lightgray"};
`;

const ProjectListItem = ({ project }: { project: ProjectInfo }) => {
  return (
    <ProjectItem>
      {/* <div className="project__item-btns">
        <div className="project__item-btn">
          <EditOutlined />
        </div>
        <div className="project__item-btn">
          <DeleteOutlined />
        </div>
      </div> */}
      <div>
        <ProjectStatus $status={project.status}>
          {project.status === "progress"
            ? "진행중"
            : project.status === "plus"
            ? "예정됨"
            : "완료됨"}
        </ProjectStatus>
        <div className="project__item-title">{project.title}</div>
        <ProjectDate duration={project.duration} />
        <ProjectAssignee assignees={project.assignees} />
      </div>
    </ProjectItem>
  );
};

export default ProjectListItem;