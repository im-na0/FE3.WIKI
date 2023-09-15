import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Draggable } from "react-beautiful-dnd";
import type { ProjectInfo } from "./ProjectDragDrop";
import styled from "styled-components";
import ProjectAssignee from "./ProjectAssignee";
import ProjectDate from "./ProjectDate";

interface ProjectDraggableProps {
  project: ProjectInfo;
  index: number;
}
const Project = styled.div`
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 6px;
  border: 1px solid #dfdfdf;
  .project__item-title {
    margin-bottom: 12px;
    font-size: 16px;
  }
`;

const ProjectDraggable = ({ project, index }: ProjectDraggableProps) => {
  // console.log(project.id, "project rendering");
  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided) => (
        <Project ref={provided.innerRef} {...provided.draggableProps}>
          <div className="project__item-btns">
            <div className="project__item-btn">
              <EditOutlined />
            </div>
            <div className="project__item-btn">
              <DeleteOutlined />
            </div>
          </div>
          <div {...provided.dragHandleProps}>
            <div className="project__item-title">{project.title}</div>
            <ProjectDate duration={project.duration} />
            <ProjectAssignee assignees={project.assignees} />
          </div>
        </Project>
      )}
    </Draggable>
  );
};

export default React.memo(ProjectDraggable);
