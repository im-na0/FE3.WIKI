import React from "react";
import { useState, useEffect } from "react";
import { styled } from "styled-components";
import { Button, Alert } from "antd";
import {
  ClockCircleOutlined,
  CheckOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

// 타이머 스타일링
interface TimerProps {
  fontSize?: string;
}
const TimerText = styled.div<TimerProps>`
  font-size: ${(props) => props.fontSize || "1.5rem"};
`;

const TimerAlign = styled.div`
  style={
  display: "flex",
  flexDirection: "column",
  justifyContent: "right",
  alignItems: "center"}`;

const GreetingText = styled.div`
  font-size: "1.5rem";
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
  const [startWorkBtnClicked, setStartWorkBtnClicked] =
    useState<boolean>(false); // 출근 버튼 클릭 가능 상태로 시작
  const [finishWorkBtnClicked, setFinishWorkBtnClicked] =
    useState<boolean>(false); // 퇴근 버튼 클릭 가능 상태로 시작
  const [clickedStartBtnText, setClickedStartBtnText] = useState<string>(""); // 출근 버튼이 클릭됐을 때 해당 시각을 버튼에 표시
  const [clickedFinishBtnText, setClickedFinishBtnText] = useState<string>(""); // 퇴근 버튼이 클릭됐을 때 해당 시각을 버튼에 표시
  const [userName, setUserName] = useState<string | null>("");

  const UpdateTime = () => {
    const nowTime = new Date().toLocaleTimeString();
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
    setStartWorkBtnClicked(true); // 출근 시간 기록 후 버튼 비활성화
    setClickedStartBtnText(nowTime);
  };

  const recordFinishWork = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 현재 시간을 퇴근 시간으로 기록

    if (!startWorkBtnClicked) {
      return alert("출근한 상태일 때만 퇴근 기록이 가능합니다!");
    }

    const finishWorkTime = new Date();
    const hours = finishWorkTime.getHours().toString().padStart(2, "0");
    const minutes = finishWorkTime.getMinutes().toString().padStart(2, "0");
    const seconds = finishWorkTime.getSeconds().toString().padStart(2, "0");
    setFinishWorkTime(`${hours}:${minutes}:${seconds}`);
    setFinishWorkBtnClicked(true); // 퇴근 시간 기록 후 버튼 비활성화
    setClickedFinishBtnText(nowTime);
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
      <TimerAlign>
        <div>
          <div>
            <TimerText>TODAY {nowDate}</TimerText>
          </div>
          <div>
            <TimerText fontSize="2.3rem">
              <ClockCircleOutlined />
              &nbsp;
              {nowTime}
            </TimerText>
          </div>
        </div>
      </TimerAlign>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          shape="default"
          size="large"
          onClick={recordStartWork}
          disabled={startWorkBtnClicked}
          style={{
            width: "130px",
            height: "60px",
            backgroundColor: startWorkBtnClicked ? "gray" : "#3956A3",
            color: startWorkBtnClicked ? "#5F5F5F" : "white",
            fontSize: startWorkBtnClicked ? "0.9rem" : "1.5rem",
            whiteSpace: "pre-wrap",
            textOverflow: "ellipsis",
            textAlign: "center",
            transition: "none",
          }}
        >
          {!startWorkBtnClicked ? (
            <>
              <CheckOutlined />
              &nbsp;출근
            </>
          ) : (
            <>
              <CheckOutlined />
              &nbsp;출근!
              <br />
              {clickedStartBtnText}
            </>
          )}
        </Button>
        <span>&nbsp;|&nbsp;</span>
        <Button
          type="primary"
          shape="default"
          size="large"
          onClick={recordFinishWork}
          disabled={finishWorkBtnClicked}
          style={{
            width: "130px",
            height: "60px",
            backgroundColor: finishWorkBtnClicked ? "gray" : "#728AC9",
            color: finishWorkBtnClicked ? "#5F5F5F" : "white",
            fontSize: finishWorkBtnClicked ? "0.9rem" : "1.5rem",
            whiteSpace: "pre-wrap",
            textOverflow: "ellipsis",
            textAlign: "center",
            transition: "none",
          }}
        >
          {!finishWorkBtnClicked ? (
            <>
              <PoweroffOutlined />
              &nbsp;퇴근
            </>
          ) : (
            <>
              <PoweroffOutlined />
              &nbsp;퇴근!
              <br />
              {clickedFinishBtnText}
            </>
          )}
        </Button>
      </div>
      {startWorkBtnClicked && !finishWorkBtnClicked && (
        <GreetingText>
          <div>좋은 하루 보내세요😊</div>
        </GreetingText>
      )}
      {startWorkBtnClicked && finishWorkBtnClicked && (
        <GreetingText>
          <div>오늘도 수고하셨습니다!👍</div>
        </GreetingText>
      )}
      {startWorkTime && finishWorkTime && <div>{calcWorkTime()}</div>}
    </form>
  );
};

export default TimerApp;
