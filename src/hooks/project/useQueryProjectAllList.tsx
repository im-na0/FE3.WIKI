import {
  projectConverter,
  projectDetailConverter,
  type ProjectInfo,
} from "../../libs/firestore";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "../../libs/firebase";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { projectDetailState } from "../../store/project";

const useQueryProjectAllList = () => {
  const [projects, setProjects] = useState<ProjectInfo[]>();
  const [, setProjectDetail] = useRecoilState(projectDetailState);
  useEffect(() => {
    (async () => {
      try {
        const projectAll: ProjectInfo[] = [];
        const q = query(
          collection(firestoreDb, "Project").withConverter(projectConverter),
        );
        const querySn = await getDocs(q);
        querySn.forEach((project) => {
          const data = project.data();
          projectAll.push(data);
        });
        setProjects(projectAll);

        const firstId = projectAll[0].id;
        const docRef = doc(firestoreDb, "Project", firstId).withConverter(
          projectDetailConverter,
        );
        const docSn = await getDoc(docRef);
        if (docSn.exists()) {
          const data = docSn.data();
          setProjectDetail(data);
        }
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    })();
  }, []);
  return projects;
};

export default useQueryProjectAllList;
