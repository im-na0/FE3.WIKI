import { atom } from "recoil";
//유저 로그인 상태 유무 확인
export const authState = atom<boolean>({
  key: "authstate",
  default: false,
});
