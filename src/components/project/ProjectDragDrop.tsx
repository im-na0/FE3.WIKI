import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ProjectDroppable from "./ProjectDroppable";

export interface ProjectInfo {
  id: string;
  title: string;
  order: number;
  assignees: string[];
  duration: string;
}

const projectList: ProjectInfo[] = [
  {
    id: "1",
    title: "주어진 업무를 잘 수행 하기a",
    order: 1,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "2",
    title: "주어진 업무를 잘 수행 하기b",
    order: 2,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "3",
    title: "주어진 업무를 잘 수행 하기c",
    order: 3,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
];
const projectList2: ProjectInfo[] = [
  {
    id: "4",
    title: "주어진 업무를 잘 수행 하기a",
    order: 1,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "5",
    title: "주어진 업무를 잘 수행 하기b",
    order: 2,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
];
const projectList3: ProjectInfo[] = [
  {
    id: "6",
    title: "주어진 업무를 잘 수행 하기a",
    order: 1,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "7",
    title: "주어진 업무를 잘 수행 하기b",
    order: 2,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "8",
    title: "주어진 업무를 잘 수행 하기c",
    order: 3,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "9",
    title: "주어진 업무를 잘 수행 하기c",
    order: 3,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
];

const ProjectDragDrop = () => {
  const onDragEnd = () => {
    console.log("");
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="drag-drop-wrap">
        <ProjectDroppable id="progress" projectList={projectList} />
        <ProjectDroppable id="plus" projectList={projectList2} />
        <ProjectDroppable id="completed" projectList={projectList3} />
      </div>
    </DragDropContext>
  );
};

export default ProjectDragDrop;
