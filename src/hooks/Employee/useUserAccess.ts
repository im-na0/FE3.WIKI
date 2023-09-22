import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notification } from "antd";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { userAccessState } from "../../store/member";

export default function useUserAccess() {
  const [userAccess, setUserAccess] = useRecoilState(userAccessState);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (firebaseUser) {
      const userId = firebaseUser.uid;
      const db = getFirestore();
      const userRef = doc(db, "Users", userId);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const access = userData?.access || null;
          setUserAccess(access);

          if (access === "admin" && !notified) {
            showAdminLoginNotification();
          }
        } else {
          setUserAccess(null);
        }
      });

      // Clean up
      return () => {
        unsubscribe();
      };
    }
  }, []);

  const showAdminLoginNotification = () => {
    notification.success({
      message: "환영합니다!",
      description: "관리자 권한으로 접속하셨습니다.",
      duration: 3,
    });
  };

  const showWarningNotification = () => {
    notification.warning({
      message: "경고",
      description: "admin 권한만 수정 할 수 있습니다!",
      duration: 3,
    });
  };

  const checkAdminPermission = () => {
    if (userAccess !== "admin") {
      showWarningNotification();
      return false;
    }
    return true;
  };

  return {
    userAccess,
    checkAdminPermission,
  };
}
