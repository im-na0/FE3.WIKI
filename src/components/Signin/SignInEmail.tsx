import React, { useState } from "react";
import { Button, Modal, Checkbox, Form, Input } from "antd";
import { styled } from "styled-components";
import { auth } from "../../libs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface FieldType {
  userEmail?: string;
  password?: string;
  remember?: string;
}
const Container = styled.div`
  margin: 0;
  padding: 0;
`;
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
  text-align: start;
`;
const ModalTitle = styled.p`
  font-size: 20px;
  margin-top: 50px;
  margin-bottom: 0;
  text-align: center;
`;
const onFinish = (values: any) => {
  console.log("Success: ", values);
};
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed: ", errorInfo);
};

const SignInEmailModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("로그인 성공:", user);
    } catch (error) {
      alert("회원가입부터 진행해주세요");
      console.error("로그인 실패:", error);
    }
  };
  return (
    <Container>
      <ModalContainer>
        <ModalTitle>Wiki에서 사용하고 있는 이메일을 적어주세요!</ModalTitle>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin: 50 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="이메일주소"
            name="userEmail"
            rules={[
              {
                required: true,
                message: "사용하고 계신 이메일을 입력해주세요!",
              },
            ]}
          >
            <Input onChange={handleEmailChange} />
          </Form.Item>

          <Form.Item<FieldType>
            label="비밀번호"
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력해주세요!" }]}
          >
            <Input.Password onChange={handlePasswordChange} />
          </Form.Item>
          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          ></Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handleSignIn}>
              제출
            </Button>
          </Form.Item>
        </Form>
      </ModalContainer>
    </Container>
  );
};
export default SignInEmailModal;
