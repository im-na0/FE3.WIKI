import { atom } from "recoil";

export const uploadFileState = atom<File | null>({
  key: "uploadFileState",
  default: null,
});

export const formDataState = atom({
  key: "formDataState",
  default: {},
});

export const selectedUserIdsState = atom<string[]>({
  key: "selectedUserIdsState",
  default: [], // 초기값
});
