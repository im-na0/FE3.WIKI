import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layouts/Layout";
import Main from "../pages/Main";
import Wiki from "../pages/Wiki";
import Project from "../pages/Project";
import Timer from "../pages/Timer";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import AddressBook from "../pages/AddressBook";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />}></Route>
        <Route path="/wiki" element={<Wiki />}></Route>
        <Route path="/project" element={<Project />}></Route>
        <Route path="/address-book" element={<AddressBook />}></Route>
        <Route path="/timer" element={<Timer />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Route>
    </Routes>
  );
};

export default Router;
