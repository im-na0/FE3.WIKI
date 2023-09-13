import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ProjectDroppable from "./ProjectDroppable";

export interface ProjectInfo {
  id: string;
  title: string;
  status: "progress" | "completed" | "plus";
  order: number;
  assignees: string[];
  duration: string;
}

export const projectList: ProjectInfo[] = [
  {
    id: "1",
    title: "주어진 업무를 잘 수행 하기a",
    status: "progress",
    order: 1,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "2",
    title: "주어진 업무를 잘 수행 하기b",
    status: "progress",
    order: 2,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "3",
    title: "주어진 업무를 잘 수행 하기c",
    status: "progress",
    order: 3,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
];
export const projectList2: ProjectInfo[] = [
  {
    id: "4",
    title: "주어진 업무를 잘 수행 하기a",
    status: "plus",
    order: 1,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "5",
    title: "주어진 업무를 잘 수행 하기b",
    status: "plus",
    order: 2,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
];
export const projectList3: ProjectInfo[] = [
  {
    id: "6",
    title: "주어진 업무를 잘 수행 하기a",
    status: "completed",
    order: 1,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "7",
    title: "주어진 업무를 잘 수행 하기b",
    status: "completed",
    order: 2,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "8",
    title: "주어진 업무를 잘 수행 하기c",
    status: "completed",
    order: 3,
    assignees: ["김OO"],
    duration: "2023.09.10 ~ 2023.09.20",
  },
  {
    id: "9",
    title: "주어진 업무를 잘 수행 하기c",
    status: "completed",
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
