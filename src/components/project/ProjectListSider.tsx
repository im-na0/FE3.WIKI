import React, { useEffect } from "react";
import ProjectListItem from "./ProjectListItem";
import useQueryProjectAllList from "../../hooks/project/useQueryProjectAllList";

const ProjectListSider = () => {
  const projects = useQueryProjectAllList();
  const projectArr = [
    ...projects["plus"],
    ...projects["progress"],
    ...projects["completed"],
  ];
  projectArr.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  useEffect(() => {
    console.log("list is rendering");
    console.log(projectArr);
  });

  return (
    <div className="project__all-list">
      {projectArr?.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectListSider;
