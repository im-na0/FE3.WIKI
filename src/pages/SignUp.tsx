import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { styled } from "styled-components";
import { Modal } from "antd";
import signInGoogle from "../components/Signin/SignInGoogle";
import { Link } from "react-router-dom";
import SignUpEmailModal from "../components/SignUp/SignUpEmail";
import { MainTitle } from "../components/SignUp/Title";
import { motion } from "framer-motion";
const Container = styled.div`
  margin: 0;
  padding: 0;
  width: 100vw;
`;
const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid black;
  border-radius: 20px;
  width: 50vw;
  margin: 100px auto;
  text-align: center;
`;
const Logo = styled.img`
  width: 150px;
  height: 50px;
  margin: 60px auto 0;
  text-align: center;
`;
const LoginBtnContainer = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const GoogleLogin = styled.button`
  border: 1px solid black;
  border-radius: 10px;
  width: 330px;
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  padding-left: 5px;
  margin: 30px auto;
  cursor: pointer;
  &:hover {
    background-color: grey;
  }
  span {
    padding-left: 35px;
  }
`;
const EmailLogin = styled(GoogleLogin)`
  margin-bottom: 20px;
`;

const IconContainer = styled.div`
  margin-right: 20px;
`;
const MoveSingIn = styled(Link)`
  text-align: center;
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  color: #1c49ff;
  span {
    color: #909090;
    font-weight: normal;
  }
`;
const SignUp = () => {
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const showModal = () => {
    setEmailModalOpen(true);
  };
  const handleCancel = () => {
    setEmailModalOpen(false);
  };
  const handleOk = () => {
    setEmailModalOpen(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <SignUpContainer>
          <Logo src="/fe3-wiki-logo.png" alt="logo"></Logo>
          <LoginBtnContainer>
            <MainTitle>
              Wiki에 오신 것을 환영합니다!
              <br />
              시작하시기 전에 회원가입을 해주세요!
            </MainTitle>
            <GoogleLogin onClick={signInGoogle}>
              <IconContainer>
                <GoogleOutlined />
              </IconContainer>
              <span>Google로 가입</span>
            </GoogleLogin>
            <span>OR</span>
            <EmailLogin onClick={showModal}>
              <IconContainer>
                <MailOutlined />
              </IconContainer>
              <span>직접 이메일 입력</span>
            </EmailLogin>
          </LoginBtnContainer>
          <MoveSingIn to="/signin">
            <span>이미 계정이 있으신가요?</span> 로그인하기
          </MoveSingIn>
        </SignUpContainer>
        <Modal open={isEmailModalOpen} onCancel={handleCancel} onOk={handleOk}>
          <SignUpEmailModal />
        </Modal>
      </Container>
    </motion.div>
  );
};

export default SignUp;
