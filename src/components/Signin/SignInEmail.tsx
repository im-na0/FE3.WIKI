import React, { useState } from "react";
import swal from "sweetalert";
import { Button, Modal, Checkbox, Form, Input } from "antd";
import { styled } from "styled-components";
import { auth, db } from "../../libs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "../../hooks/SignIn/Navigation";
import { getDoc, doc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { emailState, passwordState } from "../../store/sign";

interface FieldType {
  userEmail?: string;
  password?: string;
  remember?: string;
}
// antd Finish 함수
const onFinish = (values: any) => {
  console.log("Success: ", values);
};
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed: ", errorInfo);
};

const SignInEmailModal = () => {
  const { moveStartRegister, moveMain } = useNavigation();
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  // 이메일, 비밀번호 입력
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  // 이메일 로그인 기능
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const userUid = user.uid;
      const userDocRef = doc(db, "Users", userUid);
      const userDocSnapShot = await getDoc(userDocRef);
      if (userDocSnapShot.exists()) {
        const userInfo = userDocSnapShot.data();
        const userData = {
          newUser: userInfo,
          userUid: userUid,
        };
        localStorage.setItem("userData", JSON.stringify(userData)); // 로컬스토리지로 보내기
        moveMain();
      } else {
        console.log("정보 입력 단계 시작");
        moveStartRegister();
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      swal("Fail", "회원가입부터 진행해주세요!", "error");
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
