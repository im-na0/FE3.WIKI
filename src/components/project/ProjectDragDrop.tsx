import React, { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ProjectDroppable from "./ProjectDroppable";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoadingState, projectListState } from "../../store/project";
import useQueryProjectAllList from "../../hooks/project/useQueryProjectAllList";

export interface ProjectInfo {
  id: string;
  title: string;
  status: "progress" | "completed" | "plus";
  order: number;
  assignees: string[];
  duration: string[];
}

const ProjectDragDrop = () => {
  const projects = useQueryProjectAllList();
  const setProjects = useSetRecoilState(projectListState);
  const isLoading = useRecoilValue(isLoadingState);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // 같은 보드 내에서 이동
      setProjects((allProjects) => {
        // 이동해야할 배열을 복사합니다.
        const projCopy = [...allProjects[source.droppableId]];
        // 이동한 아이템을 잘라냅니다.
        const movedItem = projCopy.splice(source.index, 1);
        // 잘라낸 아이템을 다시 임시배열에 집어넣습니다.
        projCopy.splice(destination.index, 0, movedItem[0]);
        return {
          ...allProjects,
          [source.droppableId]: projCopy,
        };
      });
    } else {
      // 다른 보드로 이동
      setProjects((allProjects) => {
        // 이동해야할 원본배열, 대상배열을 복사합니다.
        const sourceBoard = [...allProjects[source.droppableId]];
        const targetBoard = [...allProjects[destination.droppableId]];
        // 이동한 아이템을 잘라냅니다.
        const movedItem = sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination.index, 0, movedItem[0]);
        return {
          ...allProjects,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard,
        };
      });
    }
    // console.log("draggableId: ", draggableId);
    // console.log("destination: ", destination);
    // console.log("source: ", source);
  };
  return (
    <>
      {isLoading ? null : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="drag-drop-wrap">
            {Object.keys(projects).map((key) => (
              <ProjectDroppable
                key={key}
                id={key}
                projectList={projects[key]}
              />
            ))}
          </div>
        </DragDropContext>
      )}
    </>
  );
};

export default ProjectDragDrop;
