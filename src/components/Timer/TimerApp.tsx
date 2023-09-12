import React from "react";
import { useState, useEffect } from "react";
import { styled } from "styled-components";

// 타이머 스타일링
interface TimerProps {
  fontSize?: string;
}
const TimerText = styled.div<TimerProps>`
  font-size: ${(props) => props.fontSize || "1.5rem"};
`;

const TimerBtn = styled.button<TimerProps>`
  color: white;
  background-color: #3956a3;
  padding: 15px 30px;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const TimerApp = () => {
  const nowDate = new Date().toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    weekday: "narrow",
  });

  const [nowTime, setNowTime] = useState<string>(
    new Date().toLocaleTimeString(),
  ); // 현재 시간 표시
  const [startWorkTime, setStartWorkTime] = useState<string | null>(null); // 출근 시간 기록
  const [finishWorkTime, setFinishWorkTime] = useState<string | null>(null); // 퇴근 시간 기록

  const UpdateTime = () => {
    let nowTime = new Date().toLocaleTimeString();
    setNowTime(nowTime);
  };

  useEffect(() => {
    const interval = setInterval(UpdateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const recordStartWork = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 현재 시간을 출근 시간으로 기록
    const startWorkTime = new Date();
    const hours = startWorkTime.getHours().toString().padStart(2, "0");
    const minutes = startWorkTime.getMinutes().toString().padStart(2, "0");
    const seconds = startWorkTime.getSeconds().toString().padStart(2, "0");
    setStartWorkTime(`${hours}:${minutes}:${seconds}`);
  };
  const recordFinishWork = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 현재 시간을 퇴근 시간으로 기록
    const finishWorkTime = new Date();
    const hours = finishWorkTime.getHours().toString().padStart(2, "0");
    const minutes = finishWorkTime.getMinutes().toString().padStart(2, "0");
    const seconds = finishWorkTime.getSeconds().toString().padStart(2, "0");
    setFinishWorkTime(`${hours}:${minutes}:${seconds}`);
  };

  const calcWorkTime = () => {
    if (startWorkTime && finishWorkTime) {
      const startTime = startWorkTime.split(":");
      const finishTime = finishWorkTime.split(":");
      const startHours = parseInt(startTime[0], 10);
      const startMinutes = parseInt(startTime[1], 10);
      const finishHours = parseInt(finishTime[0], 10);
      const finishMinutes = parseInt(finishTime[1], 10);

      let hours = finishHours - startHours;
      let minutes = finishMinutes - startMinutes;

      if (minutes < 0) {
        hours -= 1;
        minutes += 60;
      }

      return `오늘 총 근무 시간은 ${hours}시간 ${minutes}분 입니다.`;
    }
  };

  return (
    <form>
      <div>
        <div>
          <TimerText>TODAY {nowDate}</TimerText>
        </div>
        <div>
          <TimerText fontSize="2.5rem">{nowTime}</TimerText>
        </div>
        <br />
        <TimerBtn onClick={recordStartWork}>출근</TimerBtn> |{" "}
        <TimerBtn onClick={recordFinishWork}>퇴근</TimerBtn>
      </div>
      {startWorkTime && <div>출근! {startWorkTime}</div>}
      {finishWorkTime && <div>퇴근! {finishWorkTime}</div>}
      {startWorkTime && finishWorkTime && <div>{calcWorkTime()}</div>}
    </form>
  );
};

export default TimerApp;
