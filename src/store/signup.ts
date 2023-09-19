import { atom } from "recoil";
//현재 firebase에 있는 부서 타입
export interface Department {
  id: string;
  name: string; // 부서 이름
  teams: string[]; // 부서 안에 속해 있는 팀 이름
}
//현재 firebase에 있는 팀 타입
export interface Team {
  id: string; // Team Name
  member: string; // Team 속해 있는 멤버
}
// 회원 정보 입력할 때 유저 정보 타입
export interface User {
  name: string;
  email: string;
  phonenumber: string;
  department: string;
  team: string;
  position: string;
  photo: string;
}

// 부서 상태 전역 관리
export const departmentState = atom<Department[]>({
  key: "departmentList",
  default: [],
});

// 팀 상태 전역 관리
export const teamState = atom<Team[]>({
  key: "teamList",
  default: [],
});

// 선택한 부서 상태 전역 관리
export const selectedPartState = atom<string | undefined>({
  key: "sepectedDepartment",
  default: undefined,
});

// 선택한 팀 상태 전역 관리
export const selectedTeamState = atom<string | undefined>({
  key: "selectedTeam",
  default: undefined,
});

// 유저 회원 정보 전역 관리
export const userInfo = atom<User>({
  key: "userInfo",
  default: {
    name: "",
    email: "",
    phonenumber: "",
    department: "",
    team: "",
    position: "",
    photo: "",
  },
});
