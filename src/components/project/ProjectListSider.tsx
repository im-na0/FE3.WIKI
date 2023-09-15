import React from "react";
import ProjectListItem from "./ProjectListItem";
import useQueryProjectAllList from "../../hooks/project/useQueryProjectAllList";

const ProjectListSider = () => {
  const projects = useQueryProjectAllList();
  const projectArr = [
    ...projects["plus"],
    ...projects["progress"],
    ...projects["completed"],
  ];

  return (
    <div className="project__all-list">
      {projectArr?.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectListSider;
