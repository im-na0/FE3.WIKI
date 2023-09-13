import React from "react";
import ProjectListItem from "./ProjectListItem";
import { projectList, projectList2, projectList3 } from "./ProjectDragDrop";

const projects = [...projectList, ...projectList2, ...projectList3];

const ProjectListSider = () => {
  return (
    <div className="project__all-list">
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectListSider;
