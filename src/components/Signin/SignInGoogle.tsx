import React from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { auth, db } from "../../libs/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigation } from "../../hooks/SignIn/Navigation";
import { styled } from "styled-components";

const provider = new GoogleAuthProvider();

const SignInGoogle = () => {
  const { moveStartRegister, moveMain } = useNavigation();
  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log(user);
      const userUid = user.uid;
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnapShot = await getDoc(userDocRef);

      if (userDocSnapShot.exists()) {
        const userInfo = userDocSnapShot.data();
        const userData = {
          newUser: userInfo,
          userUid: userUid,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        moveMain();
      } else {
        moveStartRegister();
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <GoogleLogin onClick={signInWithGoogle}>
      <IconContainer>
        <GoogleOutlined />
      </IconContainer>
      <span>Google로 로그인</span>
    </GoogleLogin>
  );
};

export default SignInGoogle;

const GoogleLogin = styled.button`
  border: none;
  border-radius: 10px;
  width: 330px;
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  background-color: #6c63ff;
  color: #fff;
  font-weight: bold;
  padding-left: 5px;
  cursor: pointer;
  &:hover {
    background-color: grey;
  }
  span {
    padding-left: 35px;
  }
`;
const IconContainer = styled.div`
  margin-right: 20px;
`;
