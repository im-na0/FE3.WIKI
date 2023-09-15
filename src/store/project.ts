import { atom } from "recoil";
import { ProjectDetail, ProjectInfo } from "../libs/firestore";

export const projectDetailState = atom<ProjectDetail>({
  key: `projectDetailState`,
  default: undefined,
});
export const isModifingState = atom({
  key: "isModifingState",
  default: false,
});
export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});
interface projectListType {
  [key: string]: ProjectInfo[];
}
export const projectListState = atom<projectListType>({
  key: "projectListState",
  default: {
    plus: [],
    progress: [],
    completed: [],
  },
});
