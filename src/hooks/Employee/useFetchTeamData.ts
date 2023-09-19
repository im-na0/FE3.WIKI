import { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../libs/firebase";
import { FormDataType } from "../../type/form";
import { message } from "antd";

export function useFetchTeamData() {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<FormDataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const teamCollectionRef = collection(db, "Teams");
        const teamSnapshot = await getDocs(teamCollectionRef);

        const teamArray: any[] = [];
        teamSnapshot.forEach((doc) => {
          const teamData = { id: doc.id, ...doc.data() };
          teamArray.push(teamData);
        });

        const dataWithUsers = await Promise.all(
          teamArray.map(async (team) => {
            const userIds = Array.isArray(team.userId)
              ? team.userId
              : team.userId
              ? [team.userId]
              : []; // FIXME:
            const teamUserPromises = userIds.map(async (userId: string) => {
              let userData = {};
              if (userId) {
                const userDocRef = doc(db, "Users", userId);
                try {
                  const userDoc = await getDoc(userDocRef);
                  if (userDoc.exists()) {
                    userData = {
                      id: userDoc.id,
                      ...userDoc.data(),
                    } as FormDataType;
                  }
                } catch (error) {
                  console.error("Error fetching user data:", error);
                }
              }

              return userData;
            });

            const teamUsers = await Promise.all(teamUserPromises);

            return {
              ...team,
              teamUsers,
            };
          }),
        );

        setTeamData(dataWithUsers);
      } catch (error) {
        console.error("Error fetching team data:", error);
        message.error("데이터를 불러올 수 없습니다!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, teamData };
}
