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

export const editFileState = atom<boolean>({
  key: "isFileState",
  default: false,
});

export const editFileSubName = atom<string>({
  key: "ediFiSub",
  default: "",
});
