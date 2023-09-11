import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { styled } from "styled-components";
import EmailModal from "../components/signin/EmailModal";
import { Modal } from "antd";
const Container = styled.div`
  margin: 0;
  padding: 0;
  width: 100vw;
`;
const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid black;
  border-radius: 20px;
  width: 50vw;
  margin: 100px auto;
  text-align: center;
`;
const Logo = styled.div`
  border: 1px solid black;
  border-radius: 20px;
  width: 150px;
  height: 50px;
  line-height: 50px;
  margin: 60px auto;
  text-align: center;
`;
const MainTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  text-align: start;
  margin: 0 auto;
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
  margin-bottom: 40px;
`;

const IconContainer = styled.div`
  margin-right: 20px;
`;
const SignIn = () => {
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
    <Container>
      <SignInContainer>
        <Logo>LOGO</Logo>
        <LoginBtnContainer>
          <MainTitle>
            Wiki에 오신 것을 환영합니다!
            <br />
            시작하시기 전에 로그인을 해주세요!
          </MainTitle>
          <GoogleLogin>
            <IconContainer>
              <GoogleOutlined />
            </IconContainer>
            <span>Google로 로그인</span>
          </GoogleLogin>
          <span>OR</span>
          <EmailLogin onClick={showModal}>
            <IconContainer>
              <MailOutlined />
            </IconContainer>
            <span>직접 이메일 입력</span>
          </EmailLogin>
        </LoginBtnContainer>
      </SignInContainer>
      <Modal open={isEmailModalOpen} onCancel={handleCancel} onOk={handleOk}>
        <EmailModal />
      </Modal>
    </Container>
  );
};

export default SignIn;
