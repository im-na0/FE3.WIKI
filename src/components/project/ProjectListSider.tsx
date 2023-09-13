import React from "react";
import ProjectListItem from "./ProjectListItem";
import useQueryProjectAllList from "../../hooks/project/useQueryProjectAllList";

const ProjectListSider = () => {
  const projects = useQueryProjectAllList();

  return (
    <div className="project__all-list">
      {projects?.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectListSider;
