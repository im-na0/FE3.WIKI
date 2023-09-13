import React, { useEffect, useState } from "react";
import { auth } from "../../libs/firebase";
import { Container } from "../../pages/Employee";
import { useNavigate } from "react-router";
import SignInEmailModal from "./SignInEmail";
import Main from "../../pages/Main";

const AuthStateChanged = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setIsSignIn(true);
        navigate("/");
      } else {
        setIsSignIn(false);
      }
    });
  }, []);
  return <div>{isSignIn ? <Main /> : <SignInEmailModal />}</div>;
};

export default AuthStateChanged;
