import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ProjectDroppable from "./ProjectDroppable";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoadingState, projectListState } from "../../store/project";
import useQueryProjectAllList from "../../hooks/project/useQueryProjectAllList";
import { updateOrder } from "../../hooks/project/updateOrder";

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
      const diff: ProjectInfo[] = [];
      const origProj = [...projects[source.droppableId]];
      const projCopy = [...projects[source.droppableId]];
      const movedItem = projCopy.splice(source.index, 1);
      projCopy.splice(destination.index, 0, movedItem[0]);

      const min = projCopy.reduce(
        (acc, item) => Math.min(acc, item.order),
        1000000000,
      );

      // state를 변경합니다.
      const newProjArr = projCopy.map((item, index) => {
        const newItem = { ...item, order: min + index };
        return newItem;
      });
      // order를 비교해서 다른 요소가 있으면 넣기
      projCopy.forEach((item, index) => {
        if (item.id !== origProj[index].id) {
          // 다르다면 변경
          const proj = { ...item, order: min + index };
          diff.push(proj);
        }
      });

      setProjects((allProjects) => {
        return {
          ...allProjects,
          [source.droppableId]: newProjArr,
        };
      });

      console.log(diff);
      // 실제 firebase에 적용하기
      const deletePromise = diff.map((item) =>
        updateOrder(item.id, item.order),
      );
      Promise.all(deletePromise);
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
