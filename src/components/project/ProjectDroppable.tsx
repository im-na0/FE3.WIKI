import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import type { ProjectInfo } from "./ProjectDragDrop";
import ProjectDraggable from "./ProjectDraggable";

const Projects = styled.div`
  width: 100%;
  max-width: 342px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 6px;
  padding: 20px 10px;
  background-color: #f5f5f5;
  margin-bottom: 24px;
  h3 {
    &.progress {
      color: #00b96b;
    }
    &.plus {
      color: #004ca5;
    }
    &.completed {
      color: #555;
    }
  }
`;

interface ProjectDroppableProps {
  id: string;
  projectList: ProjectInfo[];
}

const ProjectDroppable = ({ id, projectList }: ProjectDroppableProps) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        // eslint-disable-next-line react/prop-types
        <Projects ref={provided.innerRef} {...provided.droppableProps}>
          <h3 className={id}>
            {id === "progress"
              ? "진행중인"
              : id === "plus"
              ? "예정된"
              : "완료된"}{" "}
            프로젝트
          </h3>
          {projectList.map((project, index) => (
            <ProjectDraggable
              key={project.id}
              project={project}
              index={index}
            />
          ))}
          {provided.placeholder}
        </Projects>
      )}
    </Droppable>
  );
};

export default ProjectDroppable;
