import { atom } from "recoil";

export const uploadFileState = atom<File | null>({
  key: "uploadFileState",
  default: null,
});

export const formDataState = atom({
  key: "formDataState",
  default: {},
});
