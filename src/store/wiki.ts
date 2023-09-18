import { atom } from "recoil";

export interface IWiki {
  title: string;
  items: Array<{ name: string; subName: string }>;
}

// 현재 선택한 폴더명
export const currentFolderTitle = atom<string>({
  key: "curFolderTitle",
  default: "",
});

// 현재 선택한 파일명
export const currentFileTitle = atom<string>({
  key: "curFileTitle",
  default: "",
});

// 전역 Item 속성 관리
export interface IItems {
  name: string;
  subName: string;
}

export const currentItem = atom<IItems>({
  key: "curItemState",
  default: { name: "", subName: "" },
});

export const totalItems = atom<IWiki[]>({
  key: "navItemList",
  default: [
    {
      title: "",
      items: [{ name: "", subName: "" }],
    },
  ],
});

// 폴더 이름 변경 상태
export const editFolderState = atom<boolean>({
  key: "isFolderState",
  default: false,
});

// 폴더 이름 변경
export const newFolderName = atom<string>({
  key: "newFolderTitle",
  default: "",
});

// 폴더 삭제 상태
export const deleteFolderState = atom<boolean>({
  key: "isFolderDeleteState",
  default: false,
});

// 새 파일 생성
export const newFileState = atom<boolean>({
  key: "nwFileState",
  default: false,
});

// 파일 이름 변경
export const editFileState = atom<boolean>({
  key: "isFileState",
  default: false,
});

// 파일 데이터 수정
export const editFileSubName = atom<string>({
  key: "ediFiSub",
  default: "",
});

// Select 클릭시 현재 요소 전달
export const SelectProps = atom<string | null>({
  key: "selProps",
  default: null,
});
