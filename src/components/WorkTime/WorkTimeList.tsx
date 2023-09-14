import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Segmented, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import WorkCalendar from "./WorkCalendar";

// firebase
import { db } from "../../libs/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";

interface WorkTimeProps {
  fontSize?: string;
}

interface DataType {
  key: string;
  name: string;
  department: string;
  team: string;
  starttime: Timestamp;
  finishtime: Timestamp;
  leave: string;
}

const ContainerAlign = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  margin-top: 0;
`;

const TableWrapper = styled.div`
  width: 60%;
`;

const WorkTimeText = styled.span<WorkTimeProps>`
  font-size: ${(props) => props.fontSize || "1.7rem"};
  color: ${(props) => props.color || "#3A56A3"};
`;

const WorkTimeList = () => {
  const [workTimeData, setworkTimeData] = useState<DataType[]>([]);
  const [workTimeFilter, setWorkTimeFilter] =
    useState<string>("나의 출퇴근 현황");

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
        compare: (a, b) =>
          a.starttime.toDate().getTime() - b.starttime.toDate().getTime(),
        multiple: 1,
      },
      render: (starttime) =>
        `${starttime.toDate().toLocaleDateString()}
         ${starttime.toDate().toLocaleTimeString()}`,
    },
    {
      title: "퇴근 시간",
      dataIndex: "finishtime",
      sorter: {
        compare: (a, b) =>
          a.finishtime.toDate().getTime() - b.finishtime.toDate().getTime(),
        multiple: 2,
      },
      render: (finishtime) =>
        `${finishtime.toDate().toLocaleDateString()} 
         ${finishtime.toDate().toLocaleTimeString()}`,
    },
    {
      title: "비고 (조퇴, 휴가 등)",
      dataIndex: "leave",
    },
  ];

  useEffect(() => {
    const fetchWorkTime = async () => {
      const workTimeRef = collection(db, "Users");
      const workTimeSnap = await getDocs(workTimeRef);

      const fetchedWorkTime: DataType[] = [];

      workTimeSnap.forEach((doc) => {
        const workTimeData = doc.data();
        fetchedWorkTime.push({
          key: doc.id,
          name: workTimeData.name,
          department: workTimeData.department,
          team: workTimeData.team,
          starttime: workTimeData.starttime,
          finishtime: workTimeData.finishtime,
          leave: workTimeData.leave,
        });
      });
      setworkTimeData(fetchedWorkTime);
      console.log(fetchedWorkTime);
    };

    fetchWorkTime();
  }, []);

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <WorkTimeText color="#999999" fontSize="1.2rem">
        오늘도 열일했다!
      </WorkTimeText>
      <br />
      <WorkTimeText># 나의 출퇴근 일지</WorkTimeText>
      <br />
      <br />
      <Segmented
        options={["나의 출퇴근 현황", "우리팀 출퇴근 현황"]}
        value={workTimeFilter as string}
        onChange={(value) => setWorkTimeFilter(value as string)}
      />
      <ContainerAlign>
        {workTimeFilter === "나의 출퇴근 현황" && (
          <>
            <TableWrapper>
              <Table
                columns={columns}
                dataSource={workTimeData}
                onChange={onChange}
              />
              <WorkCalendar></WorkCalendar>
            </TableWrapper>
          </>
        )}
        {workTimeFilter === "우리팀 출퇴근 현황" && (
          <>
            <TableWrapper>
              <Table
                columns={columns}
                dataSource={workTimeData}
                onChange={onChange}
              />
              <WorkCalendar></WorkCalendar>
            </TableWrapper>
          </>
        )}
      </ContainerAlign>
    </>
  );
};

export default WorkTimeList;
