import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";
// firebase
import { db, auth } from "../../libs/firebase";
import {
  collection,
  getDocs,
  CollectionReference,
  DocumentData,
  doc,
  getDoc,
} from "firebase/firestore";

const DataCellCustom = styled.div`
  overflow-y: hidden;
  margin: 0;
  padding: 0;

  ul {
    text-align: left;
    margin: 0;
    padding: 0;
  }
  li {
    text-align: left;
    margin: 0;
    padding: 0;
    font-size: 8px;
  }
`;

const WorkCalendar: React.FC = () => {
  const [leaveName, setLeaveName] = useState<string | null>("");
  const [leaveDate, setLeaveDate] = useState<Date | undefined>();
  const [leaveNote, setLeaveNote] = useState<string>("");
  const [userUid, setUserUid] = useState<string>("");
  const [leaveDateRef, setLeaveDateRef] = useState<CollectionReference<
    DocumentData,
    DocumentData
  > | null>(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      const user = auth.currentUser;
      const userUid = user ? user.uid : "ax2Eyczauq0NbDTfrB2i"; // 유저 Uid 샘플 테스트용
      setUserUid(userUid);

      console.log(userUid);

      try {
        // DB에서 해당 휴가 신청자명을 참조
        const leaveNameRef = collection(db, "Users");
        const userDoc = doc(leaveNameRef, userUid);
        const userDocSnap = await getDoc(userDoc);
        const userName = userDocSnap.data()?.name || "";

        const leaveDateRef = collection(db, `Users/${userUid}/leave`); // DB에서 휴가 내역(leave)을 참조
        setLeaveDateRef(leaveDateRef);
        const leaveDateSnap = await getDocs(leaveDateRef);

        const leaveData: { name: string; date: Date; note: string }[] = [];

        leaveDateSnap.forEach((doc) => {
          const leaveDate = doc.data().leavedate.toDate();
          const leaveNote = doc.data().leavenote;
          leaveData.push({ name: userName, date: leaveDate, note: leaveNote });
        });
        console.log(leaveData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCalendar();
  }, []);

  const getCalendarData = async (value: Dayjs) => {
    try {
      if (leaveDateRef) {
        const calendarSnap = await getDocs(leaveDateRef);
        const filteredData = calendarSnap.docs
          .map((doc) => {
            const leaveName = doc.data().name;
            const leaveDate = doc.data().leavedate.toDate();
            const leaveNote = doc.data().leavenote;
            return { type: "error", content: leaveNote, date: leaveDate };
          })
          .filter((item) => {
            const itemDate = dayjs(item.date);
            return (
              itemDate.date() === value.date() &&
              itemDate.month() + 1 === value.month() + 1
            );
          });

        return filteredData;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getCalendarData(value);
    return (
      <>
        <DataCellCustom>
          <ul className="events">
            {Array.isArray(listData) &&
              listData.map((item) => (
                <React.Fragment key={item.date.toString()}>
                  <Badge
                    status={item.type as BadgeProps["status"]}
                    text={
                      <span style={{ fontSize: "0.8rem" }}>
                        {item.date.getDate()} : {item.content}
                      </span>
                    }
                  />
                </React.Fragment>
              ))}
          </ul>
        </DataCellCustom>
      </>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};

export default WorkCalendar;
