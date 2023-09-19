import React, { useEffect } from "react";
import "../../styles/WorkTime.css";
import styled from "styled-components";
import type { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";
import locale from "antd/es/calendar/locale/ko_KR";
import useQueryWorkTime from "../../hooks/Timer/useQueryWorkTime";

const WorkCalendar = () => {
  const [isLoaded, worktime] = useQueryWorkTime();

  const getListData = (value: Dayjs) => {
    if (isLoaded) {
      const date = `${value.month() + 1}-${value.date()}`;
      const start = worktime?.find((time) => {
        const startDate = time?.starttime?.toDate();
        const dateStr = `${startDate.getMonth() + 1}-${startDate.getDate()}`;
        console.log(dateStr, date);
        return dateStr === date;
      });
      const startTime = start?.starttime?.toDate().toTimeString().split(" ")[0];
      const finish = worktime?.find((time) => {
        const endDate = time?.finishtime?.toDate();
        const dateStr = `${endDate.getMonth() + 1}-${endDate.getDate()}`;
        return dateStr === date;
      });
      const finishTime = finish?.finishtime
        ?.toDate()
        .toTimeString()
        .split(" ")[0];

      return start !== undefined
        ? [
            { type: "success", content: startTime ? "출근: " + startTime : "" },
            {
              type: "error",
              content: finishTime ? "퇴근: " + finishTime : "",
            },
          ]
        : [];
    } else {
      return [
        { type: "success", content: "" },
        { type: "warning", content: "" },
      ];
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
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
