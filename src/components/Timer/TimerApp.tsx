import React from "react";
import { useState, useEffect } from "react";
import { styled } from "styled-components";
import { Button } from "antd";
import {
  ClockCircleOutlined,
  CheckOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

// firebase
import { db, auth } from "../../libs/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import WorkTime from "../../pages/WorkTime";

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

const TimerApp = () => {
  const nowDate = new Date().toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    weekday: "narrow",
  });

  const user = auth.currentUser;
  const userUid = user ? user.uid : null;
  const userNameRef = collection(db, `Users/${userUid}`);
  const userDoc = doc(userNameRef);

  const [nowTime, setNowTime] = useState<string>(
    new Date().toLocaleTimeString(),
  ); // 현재 시간 표시
  const [userName, setUserName] = useState<string | null>(""); // 현재 로그인한 유저의 이름을 관리
  const [startWorkTime, setStartWorkTime] = useState<string | null>(null); // 출근 시간 기록
  const [finishWorkTime, setFinishWorkTime] = useState<string | null>(null); // 퇴근 시간 기록
  const [startWorkBtnClicked, setStartWorkBtnClicked] =
    useState<boolean>(false); // 출근 버튼 클릭 가능 상태로 시작
  const [finishWorkBtnClicked, setFinishWorkBtnClicked] =
    useState<boolean>(false); // 퇴근 버튼 클릭 가능 상태로 시작
  const [clickedStartBtnText, setClickedStartBtnText] = useState<string>(""); // 출근 버튼이 클릭됐을 때 해당 시각을 버튼에 표시
  const [clickedFinishBtnText, setClickedFinishBtnText] = useState<string>(""); // 퇴근 버튼이 클릭됐을 때 해당 시각을 버튼에 표시
  const [workTimeDocId, setWorkTimeDocId] = useState<string | null>(""); // starttime 기록시 자동으로 생성된 문서 ID 저장
  const [totalWorkTime, setTotalWorkTime] = useState<number>(0); // 출근 시간과 퇴근 시간을 대조하여 총 근무 시간을 계산

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userDocSnap = await getDoc(userDoc);
        const userName = userDocSnap.data()?.name || "";
        setUserName(userName);
        console.log("Fetched userName:", userName);
      } catch (error) {
        console.error("Error fetching userName:", error);
      }
    };
    fetchUserName();
  }, [userDoc]);

  // 현재 시간을 출력해주는 일반 타이머
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

  // 출근 시간을 기준으로 총 근무 시간을 출력해주는 타이머
  const updateTotalWorkTime = () => {
    if (startWorkBtnClicked && !finishWorkBtnClicked) {
      setTotalWorkTime((prevTotalWorkTime) => prevTotalWorkTime + 1);
    }
  };

  useEffect(() => {
    const totalWorkTimeInterval = setInterval(updateTotalWorkTime, 1000);

    return () => {
      clearInterval(totalWorkTimeInterval);
    };
  }, [startWorkBtnClicked, finishWorkBtnClicked]);

  const formatTotalWorkTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  };

  const recordStartWork = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const startWorkTime = serverTimestamp() as Timestamp; // 현재 시간을 출근 시간으로 기록
    const workTimeSubCollectionRef = collection(
      db,
      `Users/${userUid}/worktime`,
    );

    // worktime이라는 하위 컬렉션이 존재하는지 확인
    const subCollectionSnapShot = await getDocs(workTimeSubCollectionRef);
    if (subCollectionSnapShot.empty) {
      await setDoc(
        doc(db, `Users/${userUid}`),
        { worktime: [] },
        { merge: true },
      );
    }
    const docRef = await addDoc(workTimeSubCollectionRef, {
      starttime: startWorkTime,
    });
    console.log(docRef.id);
    setWorkTimeDocId(docRef.id); // 자동으로 생성된 문서 ID 저장
    setStartWorkBtnClicked(true); // 출근 시간 기록 후 버튼 비활성화
    setClickedStartBtnText(nowTime);
  };

  const recordFinishWork = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 현재 시간을 퇴근 시간으로 기록

    if (!startWorkBtnClicked) {
      return alert("출근한 상태일 때만 퇴근 기록이 가능합니다!");
    }

    if (workTimeDocId) {
      const finishWorkTime = serverTimestamp() as Timestamp;
      setFinishWorkBtnClicked(true); // 퇴근 시간 기록 후 버튼 비활성화
      setClickedFinishBtnText(nowTime);

      // 출근 시간이 저장된 동일 문서 ID를 참조
      const workTimeDocRef = doc(
        db,
        `Users/${userUid}/worktime/${workTimeDocId}`,
      );

      try {
        // 퇴근 시간을 해당 문서 ID에 업데이트
        await updateDoc(workTimeDocRef, {
          finishtime: finishWorkTime,
        });
        console.log("퇴근 처리가 정상적으로 완료되었습니다!");
      } catch (error) {
        console.error("퇴근 처리에 실패했습니다", error);
      }
    } else {
      console.error("worktimeDocId is null");
    }
  };

  return (
    <form>
      {userName ? `환영합니다. ${userName} 님!` : "환영합니다."}
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
        <TimerText fontSize="1.2rem" style={{ lineHeight: 2, fontWeight: 400 }}>
          좋은 하루 보내세요😊
        </TimerText>
      )}
      {startWorkBtnClicked && finishWorkBtnClicked && (
        <TimerText fontSize="1.2rem" style={{ lineHeight: 2, fontWeight: 400 }}>
          오늘도 수고하셨습니다!👍
        </TimerText>
      )}
      {(startWorkBtnClicked || finishWorkBtnClicked) && (
        <div>
          오늘 총 근무시간은 {formatTotalWorkTime(totalWorkTime)}입니다.
          <br />
        </div>
      )}
    </form>
  );
};

export default TimerApp;
