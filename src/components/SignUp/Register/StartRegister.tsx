import React from "react";
import { styled } from "styled-components";
import { ActiveDot, Dot, SlideCounter } from "../Pagination";
import { useNavigation } from "../Navigation";
import { StartSubTitle, StartTitle } from "../Title";
import { motion } from "framer-motion";
const Container = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const StartContainer = styled.div`
  width: 50%;
  margin: 100px auto;
  text-align: center;
`;
const StartBtn = styled.button`
  width: 400px;
  height: 50px;
  margin: 50px auto;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #fff;
    background-color: #000;
  }
`;
export default function StartRegister() {
  const { moveUserRegister } = useNavigation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <StartContainer>
          <StartTitle>Wiki에 오신 것을 환영합니다!</StartTitle>
          <StartSubTitle>아래 버튼을 통해 정보를 입력해주세요!</StartSubTitle>
          <StartBtn onClick={moveUserRegister}>시작하기</StartBtn>
        </StartContainer>
        <SlideCounter>
          <ActiveDot />
          <Dot />
          <Dot />
        </SlideCounter>
      </Container>
    </motion.div>
  );
}