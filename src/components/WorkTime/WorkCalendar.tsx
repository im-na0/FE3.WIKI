import React from "react";
import styled from "styled-components";

import type { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";

// firebase
import { db } from "../../libs/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";

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

const getListData = (value: Dayjs) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [{ type: "error", content: "휴가-이땡땡이" }];
      break;
    case 10:
      listData = [{ type: "error", content: "휴가-홍길동" }];
      break;
    case 15:
      listData = [{ type: "error", content: "휴가-이땡땡이" }];
      break;
    case 20:
      listData = [{ type: "warning", content: "조퇴-이땡땡이" }];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const WorkCalendar: React.FC = () => {
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
    const listData = getListData(value);
    return (
      <DataCellCustom>
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content}>
              <Badge
                status={item.type as BadgeProps["status"]}
                text={
                  <span style={{ fontSize: "0.8rem" }}>{item.content}</span>
                }
              />
            </li>
          ))}
        </ul>
      </DataCellCustom>
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
