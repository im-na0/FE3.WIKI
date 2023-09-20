import React from "react";
import ProjectListItem from "./ProjectListItem";
import useQueryProjectAllList from "../../hooks/project/useQueryProjectAllList";
import useQueryParam from "../../hooks/project/useQueryParam";

const ProjectListSider = () => {
  const status = useQueryParam().get("status");
  const projects = useQueryProjectAllList();
  const projectArr =
    status === null
      ? [...projects["plus"], ...projects["progress"], ...projects["completed"]]
      : [...projects[status]];
  projectArr.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return (
    <div className="project__all-list">
      {projectArr?.map((project) => (
        <ProjectListItem key={project.id} project={project} status={status} />
      ))}
    </div>
  );
};

export default ProjectListSider;
