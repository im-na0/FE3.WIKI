import { db } from "../../libs/firebase";
import { runTransaction, doc, arrayRemove } from "firebase/firestore";
import { message } from "antd";

interface DeleteDataParams {
  COLLECTION_NAME: string;
}

export function useDeleteData({ COLLECTION_NAME }: DeleteDataParams) {
  const deleteData = async (id: string, teamId?: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        // 유저 도큐먼트 참조
        const userDocRef = doc(db, COLLECTION_NAME, id);

        if (teamId) {
          // 팀 도큐먼트 참조 및 데이터 가져오기
          const teamDocRef = doc(db, "Teams", teamId);
          const teamDoc = await transaction.get(teamDocRef);

          // 팀 도큐먼트에 유저 ID가 있는 경우 제거
          if (teamDoc.exists() && teamDoc.data()?.userId?.includes(id)) {
            transaction.update(teamDocRef, {
              userId: arrayRemove(id),
            });
          }
        }
        // 유저 삭제
        transaction.delete(userDocRef);
      });

      message.success("작업이 성공적으로 수행되었습니다.");
    } catch (error) {
      console.error("Error in transaction:", error);
      message.error("삭제 중 오류가 발생했습니다 ");
    }
  };

  return { deleteData };
}
