import React, { useEffect } from "react";
import { auth } from "../../libs/firebase";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { authState } from "../../store/signin";
import StartRegister from "../SignUp/Register/StartRegister";
import SignIn from "../../pages/SignIn";
import Main from "../../pages/Main";

const AuthStateChanged = () => {
  // const [isSignIn, setIsSignIn] = useState(false);
  const [isSignIn, setIsSignIn] = useRecoilState(authState);
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setIsSignIn(true);
        navigate("/start-register");
      } else {
        setIsSignIn(false);
        console.log("Status : Logout");
      }
    });
  }, []);
  return <div>{isSignIn ? <Main /> : null}</div>;
};

export default AuthStateChanged;
