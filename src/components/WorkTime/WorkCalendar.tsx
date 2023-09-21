import React, { useEffect } from "react";
import "../../styles/WorkTime.css";
import styled from "styled-components";
import type { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";
import locale from "antd/es/calendar/locale/ko_KR";
import useQueryWorkTime from "../../hooks/Timer/useQueryWorkTime";
import useQueryLeave from "../../hooks/WorkTime/useQueryLeave";

const WorkCalendar = () => {
  const [isLoaded, worktime] = useQueryWorkTime();
  const [isLeaveLoaded, userName, leaveData, leaveNote] = useQueryLeave();

  const getListData = (value: Dayjs) => {
    const date = `${value.month() + 1}-${value.date()}`;
    // isLeaveLoaded 코드에서도 사용하기 위해, 임의로 초기값을 지정해줌.
    const startTime = "";
    const finishTime = "";

    if (isLoaded) {
      const start = worktime?.find((time) => {
        const startDate = time?.starttime?.toDate();
        const dateStr = startDate
          ? `${startDate.getMonth() + 1}-${startDate.getDate()}`
          : "";
        return dateStr === date;
      });
      const startTime = start?.starttime?.toDate().toTimeString().split(" ")[0];
      const finish = worktime?.find((time) => {
        const endDate = time?.finishtime?.toDate();
        const dateStr = endDate
          ? `${endDate.getMonth() + 1}-${endDate.getDate()}`
          : "";
        return dateStr === date;
      });
      const finishTime = finish?.finishtime
        ?.toDate()
        .toTimeString()
        .split(" ")[0];

      if (start !== undefined) {
        return [
          { type: "success", content: startTime ? "출근: " + startTime : "" },
          {
            type: "error",
            content: finishTime ? "퇴근: " + finishTime : "",
          },
        ];
      } else {
        return null; // 출력할 내용이 없을 시 null 값을 반환
      }
    }

    if (isLeaveLoaded) {
      const leaveInfo = (leaveData ?? []).find((leave) => {
        const leaveDate = leave.leavedate?.toDate();
        const dateStr = leaveDate
          ? `${leaveDate.getMonth() + 1}-${leaveDate.getDate()}`
          : "";
        console.log(dateStr, date);
        alert(`leavenote: ${leave.leavenote}`);

        return dateStr === date;
      });

      const leaveType = leaveInfo ? "error" : "warning";
      const leaveContent = leaveInfo ? leaveInfo.leavenote : "";

      if (leaveInfo) {
        return [
          {
            type: leaveType as BadgeProps["status"],
            content: leaveContent,
          },
        ];
      } else {
        return null; // 출력할 내용이 없을 시 null 값을 반환
      }
    } else {
      return null; // 출력할 내용이 없을 시 null 값을 반환
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);

    if (listData === null) {
      return null; // 출력할 내용이 없을 시 null 값을 반환
    }

    return (
      <ul className="worktime">
        {listData.map((item) => (
          <li key={item.type}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") {
      return dateCellRender(current);
    }
    return info.originNode;
  };

  return (
    <CustomCell>
      {!isLoaded ? null : <Calendar locale={locale} cellRender={cellRender} />}
    </CustomCell>
  );
};

const CustomCell = styled.div`
  overflow-x: hidden;
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

export default WorkCalendar;
