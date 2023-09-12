import React from "react";

interface ProjectNewProps {
  isEdit?: boolean;
}

const ProjectNew = ({ isEdit }: ProjectNewProps) => {
  if (isEdit) return <div>ProjectEdit</div>;
  else return <div>ProjectNew</div>;
};

export default ProjectNew;
