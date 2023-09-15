/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Editor } from "@toast-ui/react-editor";
import {
  collection,
  doc,
  getCountFromServer,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { RefObject } from "react";
import { db } from "../../libs/firebase";
import { ProjectDetail, projectDetailConverter } from "../../libs/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
// import { useRecoilState } from "recoil";
// import { isModifingState } from "../../store/project";

type formValues = Pick<
  ProjectDetail,
  "title" | "assignees" | "teams" | "duration"
>;

export const useMutationNewProject = ({
  editorRef,
  isEdit,
}: {
  editorRef: RefObject<Editor>;
  isEdit: boolean;
}): {
  onFinish: (values: formValues) => Promise<void>;
} => {
  const location = useLocation();
  // const [, setIsModifying] = useRecoilState(isModifingState);
  // const [markdown, setMarkdown] = useState<string>();
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY/MM/DD";
  const navigate = useNavigate();

  const onFinish = async (values: formValues): Promise<void> => {
    if (isEdit) void onClickUpdate(values);
    else void onClickWrite(values);
  };

  const onClickWrite = async (values: formValues): Promise<void> => {
    const markdown = editorRef.current?.getInstance().getMarkdown();
    const day1 = dayjs(values.duration[0]).format(dateFormat);
    const day2 = dayjs(values.duration[1]).format(dateFormat);

    const q = query(collection(db, "Project"), where("status", "==", "plus"));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log(markdown);
    await setDoc(
      doc(collection(db, "Project")).withConverter(projectDetailConverter),
      {
        ...values,
        duration: [day1, day2],
        order: count + 1,
        status: "plus",
        data: markdown!,
      },
    );
    navigate("/project/all");
  };
  const onClickUpdate = async (values: formValues): Promise<void> => {
    const markdown = editorRef.current?.getInstance().getMarkdown();
    // TODO: 변한 값만 setDoc 하는 작업 고려해보기
    const day1 = dayjs(values.duration[0]).format(dateFormat);
    const day2 = dayjs(values.duration[1]).format(dateFormat);

    console.log(markdown);

    const projectId = location.pathname.split("/")[2];
    if (projectId) {
      await updateDoc(doc(db, "Project", projectId), {
        ...values,
        duration: [day1, day2],
        data: markdown!,
      });
      navigate(`/project/${projectId}`);
    }
  };

  return {
    onFinish,
  };
};
