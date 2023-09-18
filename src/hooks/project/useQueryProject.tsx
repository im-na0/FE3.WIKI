import { useEffect } from "react";
import { db } from "../../libs/firebase";
import { doc, getDoc } from "firebase/firestore";
import { projectDetailConverter } from "../../libs/firestore";
import { useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoadingState, projectDetailState } from "../../store/project";

export const useQueryProject = () => {
  const location = useLocation();
  const projectId = location.pathname.split("/")[2];
  const [projectDetail, setProjectDetail] = useRecoilState(projectDetailState);
  const setIsLoading = useSetRecoilState(isLoadingState);

  useEffect(() => {
    if (projectId === undefined) return;
    setIsLoading(true);
    (async () => {
      try {
        const docRef = doc(db, "Project", projectId).withConverter(
          projectDetailConverter,
        );
        const docSn = await getDoc(docRef);
        if (docSn.exists()) {
          const data = docSn.data();
          setProjectDetail(data);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) console.error(error.message);
      }
    })();
  }, [projectId]);
  return projectDetail;
};
