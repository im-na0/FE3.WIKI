import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Segmented, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import WorkCalendar from "./WorkCalendar";

// firebase
import { db, auth } from "../../libs/firebase";
import {
  collection,
  doc,
  getDocs,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

interface WorkTimeProps {
  fontSize?: string;
}

type teamDataType = {
  key: string;
  name: string;
  department: string;
  team: string;
  starttime?: Timestamp;
  finishtime?: Timestamp;
};

interface DataType {
  key?: string;
  name?: string;
  department?: string;
  team?: string;
  starttime: Timestamp;
  finishtime: Timestamp;
}

const WorkTimeList: React.FC = () => {
  const [workTimeData, setWorkTimeData] = useState<DataType[]>([]);
  const [workTimeFilter, setWorkTimeFilter] =
    useState<string>("나의 출퇴근 현황");

  const user = auth.currentUser;
  const userUid = user ? user.uid : null;

  const columns: ColumnsType<DataType> = [
    {
      title: "이름",
      dataIndex: "name",
    },
    {
      title: "부서",
      dataIndex: "department",
    },
    {
      title: "소속팀",
      dataIndex: "team",
    },
    {
      title: "출근 시간",
      dataIndex: "starttime",
      sorter: {
        compare: (a, b) => {
          const aTime = a.starttime ? a.starttime.toDate().getTime() : 0;
          const bTime = b.starttime ? b.starttime.toDate().getTime() : 0;
          return aTime - bTime;
        },
        multiple: 1,
      },
      render: (starttime) =>
        starttime
          ? `${starttime.toDate().toLocaleDateString()} ${
              starttime && starttime.toDate().toLocaleTimeString()
            }`
          : "",
    },
    {
      title: "퇴근 시간",
      dataIndex: "finishtime",
      sorter: {
        compare: (a, b) => {
          const aTime = a.finishtime ? a.finishtime.toDate().getTime() : 0;
          const bTime = b.finishtime ? b.finishtime.toDate().getTime() : 0;
          return aTime - bTime;
        },
        multiple: 2,
      },
      render: (finishtime) =>
        finishtime
          ? `${finishtime.toDate().toLocaleDateString()} ${
              finishtime && finishtime.toDate().toLocaleTimeString()
            }`
          : "",
    },
  ];

  useEffect(() => {
    const fetchWorkTime = async () => {
      try {
        if (workTimeFilter === "나의 출퇴근 현황") {
          const myDocRef = doc(db, `Users/${userUid}`);
          const myDocSnap = await getDoc(myDocRef);
          const myDocData = myDocSnap.data() || {};

          const myWorkTimeRef = collection(db, `Users/${userUid}/worktime`);
          const myWorkTimeSnap = await getDocs(myWorkTimeRef);

          const unsubscribe = onSnapshot(myWorkTimeRef, (snapshot) => {
            const updatedMyWorkTime: DataType[] = [];
            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
              const myWorkTimeData = doc.data();
              updatedMyWorkTime.push({
                key: doc.id,
                name: myDocData.name || "",
                department: myDocData.department || "",
                team: myDocData.team || "",
                starttime: myWorkTimeData.starttime,
                finishtime: myWorkTimeData.finishtime,
              });
            });
            setWorkTimeData(updatedMyWorkTime);
          });

          return () => {
            unsubscribe();
          };
        } else if (workTimeFilter === "우리팀 출퇴근 현황") {
          const teamDocRef = collection(db, "Users");
          const teamDocSnap = await getDocs(teamDocRef);

          const unsubscribe = onSnapshot(teamDocRef, async (snapshot) => {
            const updatedTeamWorkTime: DataType[] = [];
            const teamDocData: teamDataType[] = [];

            const teamUserDocs = snapshot.docs;

            for (const teamUserDoc of teamUserDocs) {
              const teamUserId = teamUserDoc.id;
              const teamWorkTimeRef = collection(
                db,
                "Users",
                teamUserId,
                "worktime",
              );
              const teamWorkTimeSnap = await getDocs(teamWorkTimeRef);

              teamWorkTimeSnap.forEach((doc) => {
                const teamUserData = teamUserDoc.data();
                const teamWorkTimeData = doc.data();
                updatedTeamWorkTime.push({
                  key: doc.id,
                  name: teamUserData.name || "",
                  department: teamUserData.department || "",
                  team: teamUserData.team || "",
                  starttime: teamWorkTimeData.starttime,
                  finishtime: teamWorkTimeData.finishtime,
                });
              });
            }
            setWorkTimeData(updatedTeamWorkTime);
          });

          return () => {
            // Unsubscribe the listener when the component unmounts
            unsubscribe();
          };
        }
      } catch (error) {
        console.error("Error fetching worktime data", error);
      }
    };

    fetchWorkTime();
  }, [workTimeFilter, userUid]);

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <Container>
      <LeftContainer>
        <WorkTimeText color="#999999" fontSize="1.2rem">
          오늘도 열일했다!
        </WorkTimeText>
        <br />
        <WorkTimeText># 출퇴근 일지</WorkTimeText>
        <br />
        <br />
        <Segmented
          options={["나의 출퇴근 현황", "우리팀 출퇴근 현황"]}
          value={workTimeFilter as string}
          onChange={(value) => setWorkTimeFilter(value as string)}
        />
        <TableWrapper>
          <Table
            columns={columns}
            dataSource={workTimeData}
            onChange={onChange}
            pagination={{ position: ["bottomCenter"] }}
          />
          <PaginationWrapper></PaginationWrapper>
        </TableWrapper>
      </LeftContainer>
      <RightContainer>
        <WorkCalendar></WorkCalendar>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LeftContainer = styled.div`
  flex: 6;
`;

const WorkTimeText = styled.span<WorkTimeProps>`
  font-size: ${(props) => props.fontSize || "1.7rem"};
  color: ${(props) => props.color || "#3A56A3"};
`;
const TableWrapper = styled.div`
  width: 100%;
  padding: 1rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const RightContainer = styled.div`
  flex: 4;
  margin-left: 5px;
`;

export default WorkTimeList;
