import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notification } from "antd";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { userAccessState } from "../../store/member";

export default function useUserAccess() {
  const [userAccess, setUserAccess] = useRecoilState(userAccessState);
  const [notified, setNotified] = useState(false); // 상태 변수 추가

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

          // 관리자 권한을 감지하면 알림을 보여줍니다.
          if (access === "admin" && !notified) {
            // 여기서 확인
            showAdminLoginNotification();
            setNotified(true); // 알림이 표시되면 상태를 true로 설정
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
  }, [setUserAccess, setNotified]);

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
