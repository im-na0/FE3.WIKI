import React, { useState } from "react";
import { styled } from "styled-components";
import TimerApp from "../components/Timer/TimerApp";

const TimerContainer = styled.div`
  width: 320px;
  height: 260px;
  border: 2px solid #3956a3;
  border-radius: 40px;
  padding: 15px 25px;
  box-sizing: border-box;
  white-space: pre-line;
  display: flex;
  justify-content: flex-end;
  font-size: 1rem;
  z-index: 999;
  position: absolute;
  top: 10%;
  right: 5%;
`;

const TextAlign = styled.div`
  text-align: right;
`;

const CloseModalBtn = styled.div`
  width: 5px;
  height: 5px;
  cursor: pointer;
  color: #535353;
`;
// const [closeModal, setCloseModal] = useState<Boolean>(false);

const Timer = () => {
  // const closeModal = () => {
  //   setCloseModal(true);
  // };

  return (
    <TimerContainer>
      <CloseModalBtn>X</CloseModalBtn>
      <TextAlign>
        <br />
        환영합니다. OOO 님!
        <TimerApp />
      </TextAlign>
    </TimerContainer>
  );
};

export default Timer;
