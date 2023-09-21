import { atom, selector } from "recoil";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const userAccessState = atom({
  key: "userAccessState",
  default: null,
});

type UserDataType = {
  access?: string;
} | null;

export const userState = atom<UserDataType>({
  key: "userState",
  default: null,
});

export const fetchUserAccess = selector({
  key: "fetchUserAccess",
  get: async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (userId) {
      const db = getFirestore();
      const userRef = doc(db, "Users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        return userData?.access || null;
      }
    }
    return null;
  },
});

export const selectedUserIdsState = atom<string[]>({
  key: "selectedUserIdsState",
  default: [],
});

export const userIdsState = atom<string[]>({
  key: "userIdsState",
  default: [],
});
