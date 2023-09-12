import React from "react";
import { styled } from "styled-components";
import TimerApp from "../components/Timer/TimerApp";

const TimerBorder = styled.div`
  width: 100vw;
  height: 100vh;
  border: 2px solid #3956a3;
  border-radius: 40px;
  padding: 20px;
  box-sizing: border-box;
  white-space: pre-line;
  display: flex;
  justify-content: flex-end;
  font-size: 1rem;
`;

const TextAlign = styled.div`
  text-align: right;
`;

const Timer = () => {
  return (
    <TimerBorder>
      <TextAlign>
        <div>
          <div>
            <br />
            환영합니다. OOO 님!
            <TimerApp />
          </div>
        </div>
      </TextAlign>
    </TimerBorder>
  );
};

export default Timer;
