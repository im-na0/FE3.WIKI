import React from "react";
import { styled } from "styled-components";

export const MainTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  text-align: start;
  margin: 0 auto;
`;

export const StartTitle = styled.p`
  margin-top: 30px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
`;
export const StartSubTitle = styled.p`
  font-size: 20px;
  color: #d9d9d9;
  text-align: center;
`;
export const EndTitle = styled(StartTitle)``;
export const EndSubTitle = styled(StartSubTitle)``;

export const ModalTitle = styled.p`
  font-size: 20px;
  margin-top: 50px;
  margin-bottom: 0;
  text-align: center;
`;