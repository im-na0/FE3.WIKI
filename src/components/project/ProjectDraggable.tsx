import React from "react";
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Draggable } from "react-beautiful-dnd";
import type { ProjectInfo } from "./ProjectDragDrop";
import styled from "styled-components";

interface ProjectDraggableProps {
  project: ProjectInfo;
  index: number;
}
const Project = styled.div`
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  .project__item-info {
    margin-bottom: 6px;
  }
  .text-block {
    display: inline-block;
    font-size: 12px;
    padding: 3px 5px;
    margin-left: 6px;
    &.user-block {
      background-color: lightgrey;
    }
    &.date-block {
      background-color: lightpink;
    }
  }
`;

const ProjectDraggable = ({ project, index }: ProjectDraggableProps) => {
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
            <div className="project__item-info">{project.title}</div>
            <div className="project__item-info">
              <CalendarOutlined />
              <span className="text-block date-block">{project.duration}</span>
            </div>
            <div className="project__item-info">
              <UserOutlined />
              {project.assignees.map((assignee) => (
                <span className="text-block user-block" key={assignee}>
                  {assignee}
                </span>
              ))}
            </div>
          </div>
        </Project>
      )}
    </Draggable>
  );
};

export default ProjectDraggable;
