import { db } from "../../libs/firebase";
import {
  runTransaction,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { message } from "antd";

export const useUpdateTeamForMember = () => {
  const updateTeamForMember = async (
    memberId: string,
    currentTeamId: string,
    newTeamId: string,
  ) => {
    await runTransaction(db, async (transaction) => {
      // 멤버의 현재 팀 가져오기
      const memberRef = doc(db, "Users", memberId);
      const memberDoc = await transaction.get(memberRef);
      if (!currentTeamId) {
        throw new Error("The member doesn't belong to any team.");
      }
      transaction.update(memberRef, { teamId: newTeamId }); // 멤버의 팀 정보 업데이트

      const oldTeamRef = doc(db, "Teams", currentTeamId); // 기존 팀에서 멤버 제거
      console.log(currentTeamId);

      transaction.update(oldTeamRef, { userId: arrayRemove(memberId) });

      const newTeamRef = doc(db, "Teams", newTeamId); // 새팀에 멤버 추가
      transaction.update(newTeamRef, { userId: arrayUnion(memberId) });
    });
  };

  return { updateTeamForMember };
};
