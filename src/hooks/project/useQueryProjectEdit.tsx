import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ProjectDetail,
  TeamList,
  UserList,
  projectDetailConverter,
  teamListConverter,
  userListConverter,
} from "../../libs/firestore";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../../libs/firebase";

const useQueryProjectEdit = (): [
  teams: TeamList[] | undefined,
  users: UserList[] | undefined,
  projectDetail: ProjectDetail | undefined,
  isLoaded: boolean,
] => {
  const { pathname } = useLocation();
  const projectId = pathname.split("/")[2];
  const [teams, setTeams] = useState<TeamList[]>();
  const [users, setUsers] = useState<UserList[]>();
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const [isLoaded, setIsLoaded] = useState(false);

  const teamQuery = async (): Promise<TeamList[]> => {
    const q = query(collection(db, "Teams").withConverter(teamListConverter));
    const sn = await getDocs(q);
    const data: TeamList[] = [];
    sn.forEach((team) => {
      data.push(team.data());
    });
    return data;
  };
  const userQuery = async (): Promise<UserList[]> => {
    const q = query(collection(db, "Users").withConverter(userListConverter));
    const sn = await getDocs(q);
    const data: UserList[] = [];
    sn.forEach((user) => {
      data.push(user.data());
    });
    return data;
  };
  const projectQuery = async (): Promise<ProjectDetail | undefined> => {
    const docRef = doc(db, "Project", projectId).withConverter(
      projectDetailConverter,
    );
    const docSn = await getDoc(docRef);
    let data: ProjectDetail;
    if (docSn.exists()) {
      data = docSn.data();
      return data;
    }
  };

  useEffect(() => {
    try {
      //
      (async () => {
        const team = await teamQuery();
        const user = await userQuery();
        setTeams(team);
        setUsers(user);
        if (projectId) {
          const project = await projectQuery();
          setProjectDetail(project);
        }
      })();
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  return [teams, users, projectDetail, isLoaded];
};

export default useQueryProjectEdit;
