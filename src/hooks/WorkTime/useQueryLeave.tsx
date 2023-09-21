import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from "../../libs/firebase";
import { LeaveDateInfo, leaveDateConverter } from "../../libs/firestore";

const useQueryLeave = (): [
  isLeaveLoaded: boolean,
  userName: string | undefined,
  leaveData: LeaveDateInfo[] | undefined,
  leaveNote: string[],
] => {
  const user = auth.currentUser;
  const userUid = user ? user.uid : null;
  const start = new Date("2023-08-15");
  const end = new Date("2023-10-15");
  const [isLeaveLoaded, setIsLeaveLoaded] = useState(false);
  const [leaveData, setLeaveData] = useState<LeaveDateInfo[] | undefined>();
  const [leaveNote, setLeaveNote] = useState<string[]>([]);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const getLeaveData = async () => {
    const leaveDateNotedata: LeaveDateInfo[] = [];

    // 휴가 일자(leavedate) 추출 쿼리
    const leaveDateQuery = query(
      collection(db, `Users/${userUid}/leave`).withConverter(
        leaveDateConverter,
      ),
      where("starttime", ">=", start),
      where("starttime", "<=", end),
    );

    const leaveDateSnapshot = await getDocs(leaveDateQuery);
    leaveDateSnapshot.forEach((leaveDateDoc) => {
      const leaveDateData = leaveDateDoc.data() as LeaveDateInfo;
      leaveDateNotedata.push(leaveDateData);
    });

    // 휴가 비고 내역(leavenote) 추출 쿼리
    const leaveNoteQuery = query(
      collection(db, `Users/${userUid}/leave`),
      where("starttime", ">=", start),
      where("starttime", "<=", end),
    );
    const leaveNoteSnapshot = await getDocs(leaveNoteQuery);
    leaveNoteSnapshot.forEach((leaveNoteDoc) => {
      const leaveNoteData = leaveNoteDoc.data() as LeaveDateInfo;
      leaveDateNotedata.push(leaveNoteData);
    });

    // 유저 이름 추출 쿼리
    const userQuery = query(collection(db, "Users"));
    const userSnapShot = await getDocs(userQuery);

    if (userSnapShot.docs.length > 0) {
      const userData = userSnapShot.docs[0].data();
      setUserName(userData.name);
    }

    return leaveDateNotedata;
  };

  useEffect(() => {
    try {
      (async () => {
        const leaveDateNotedata = await getLeaveData();
        if (leaveDateNotedata !== null) {
          setLeaveData(leaveDateNotedata);
        }
        setIsLeaveLoaded(true);
      })();
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }, []);

  return [isLeaveLoaded, userName, leaveData, leaveNote];
};

export default useQueryLeave;
