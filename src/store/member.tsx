import { atom, selector } from "recoil";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const userAccessState = atom<string | null>({
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
  get: async ({ get }) => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userId = firebaseUser.uid;
          console.log(userId);
          const db = getFirestore();
          const userRef = doc(db, "Users", userId);
          const docSnap = await getDoc(userRef);
          console.log("Doc Exists:", docSnap.exists());
          if (docSnap.exists()) {
            console.log("Doc Data:", docSnap.data());
            const userData = docSnap.data();
            resolve(userData?.access || null);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
      // Clean up subscription
      return () => unsubscribe();
    });
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
