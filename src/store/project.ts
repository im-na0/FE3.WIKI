import { atom } from "recoil";
import { ProjectDetail } from "../libs/firestore";

export const projectDetailState = atom<ProjectDetail>({
  key: `projectDetailState`,
  default: {
    id: "",
    title: "",
    status: "plus",
    order: 1,
    assignees: [""],
    duration: "",
    data: "",
  },
});
