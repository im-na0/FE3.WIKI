import { atom } from "recoil";
//유저 로그인 상태 유무 확인
export const authState = atom<boolean>({
  key: "authstate",
  default: false,
});
// 유저 로그인 시 유저 정보 데이터 확인
export const userInfo = atom<string>({
  key: "userinfo",
  default: "",
  dangerouslyAllowMutability: true,
});
