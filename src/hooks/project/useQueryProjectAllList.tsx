import { projectConverter, type ProjectInfo } from "../../libs/firestore";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { firestoreDb } from "../../libs/firebase";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoadingState, projectListState } from "../../store/project";

const useQueryProjectAllList = () => {
  const setIsLoading = useSetRecoilState(isLoadingState);
  const [projects, setProjects] = useRecoilState(projectListState);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const projectPlus: ProjectInfo[] = [];
        const projectProgress: ProjectInfo[] = [];
        const projectCompleted: ProjectInfo[] = [];
        const q = query(
          collection(firestoreDb, "Project").withConverter(projectConverter),
          orderBy("createdAt", "desc"),
        );
        const querySn = await getDocs(q);
        querySn.forEach((project) => {
          const data = project.data();
          switch (data.status) {
            case "plus":
              projectPlus.push(data);
              break;
            case "progress":
              projectProgress.push(data);
              break;
            case "completed":
              projectCompleted.push(data);
              break;
          }
        });
        setProjects({
          plus: projectPlus,
          progress: projectProgress,
          completed: projectCompleted,
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) console.log(error.message);
      }
    })();
  }, []);
  return projects;
};

export default useQueryProjectAllList;
