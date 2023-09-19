import { atom } from "recoil";

export const selectedUserIdsState = atom<string[]>({
  key: "selectedUserIdsState",
  default: [],
});

export const userIdsState = atom<string[]>({
  key: "userIdsState",
  default: [],
});
