import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../libs/firebase";
import { projectConverter, ProjectInfo } from "../../libs/firestore";
import { projectListType } from "../../store/project";

const useQueryProjectTeam = (): [
  teamProj: projectListType | undefined,
  setTeamProj: React.Dispatch<
    React.SetStateAction<projectListType | undefined>
  >,
  isLoaded: boolean,
] => {
  const userData = localStorage.getItem("userData");
  const [teamProj, setTeamProj] = useState<projectListType>();
  const [isLoaded, setIsLoaded] = useState(false);

  const teamProjQuery = async (teamName: string) => {
    let data: projectListType = {};
    const projectPlus: ProjectInfo[] = [];
    const projectProgress: ProjectInfo[] = [];
    const projectCompleted: ProjectInfo[] = [];
    const q = query(
      collection(db, "Project").withConverter(projectConverter),
      where("teams", "array-contains", teamName),
      orderBy("order", "desc"),
    );
    const sn = await getDocs(q);
    sn.forEach((project) => {
      const data = project.data();
      switch (data.status) {
        case "plus":
          projectPlus.unshift(data);
          break;
        case "progress":
          projectProgress.unshift(data);
          break;
        case "completed":
          projectCompleted.unshift(data);
          break;
      }
    });
    data = {
      plus: projectPlus,
      progress: projectProgress,
      completed: projectCompleted,
    };
    return data;
  };

  useEffect(() => {
    // 유저 정보가 없으면 불러오지 않습니다.
    if (userData === null) return;

    const {
      newUser: { team },
    } = JSON.parse(userData);

    try {
      // 리턴값이 없고 state만 변경하여 void로 처리했습니다.
      (async () => {
        const data = await teamProjQuery(team);
        setTeamProj(data);
      })();
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  return [teamProj, setTeamProj, isLoaded];
};

export default useQueryProjectTeam;
