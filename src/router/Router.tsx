import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import SubLayout from "../layouts/SubLayout";
import Main from "../pages/Main";
import Wiki from "../pages/Wiki";
import Project from "../pages/Project";
import ProjectList from "../pages/ProjectList";
import ProjectNew from "../pages/ProjectNew";
import ProjectDetail from "../pages/ProjectDetail";
import Timer from "../pages/Timer";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Employee from "../pages/Employee";
import StartRegister from "../components/SignUp/Register/StartRegister";
import UserRegister from "../components/SignUp/Register/UserRegister";
import EndRegister from "../components/SignUp/Register/EndRegister";
import { setPersistence, browserSessionPersistence } from "@firebase/auth";
import { auth } from "../libs/firebase";
import AddInfo from "../components/SignUp/AddInfo/AddInfo";
const Router = () => {
  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log("로그인 유지 설정 완료");
      })
      .catch((error) => {
        console.error("로그인 유지 설정 오류:", error);
      });
  }, []);

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/start-register" element={<StartRegister />}></Route>
      <Route path="/user-register" element={<UserRegister />}></Route>
      <Route path="/end-register" element={<EndRegister />}></Route>
      {/*  addinfo 삭제 예정 */}
      <Route path="/addinfo" element={<AddInfo />}></Route>
      <Route element={<SubLayout />}>
        <Route path="/" index element={<Main />}></Route>
        <Route path="/wiki" element={<Wiki />}></Route>
        <Route path="/project" element={<Project />}></Route>
        <Route path="/project/all" element={<ProjectList />}></Route>
        <Route
          path="/project/new"
          element={<ProjectNew isEdit={false} />}
        ></Route>
        <Route path="/project/:projectId" element={<ProjectDetail />}></Route>
        <Route
          path="/project/:projectId/edit"
          element={<ProjectNew isEdit={true} />}
        ></Route>
        <Route path="/employee" element={<Employee />}></Route>
        <Route path="/timer" element={<Timer />}></Route>
      </Route>
    </Routes>
  );
};

export default Router;
