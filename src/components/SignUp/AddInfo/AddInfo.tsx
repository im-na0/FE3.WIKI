import React, { useEffect, useState } from "react";
import { Button, Input, Select, Upload, message } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { MainTitle } from "../Title";
import { SlideCounter, Dot, ActiveDot } from "../Pagination";
import { useNavigation } from "../Navigation";
import { motion } from "framer-motion";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { doc } from "prettier";
import { db } from "../../../libs/firebase";
import { useNavigate } from "react-router-dom";
// department firebase에서 가져오는 함수
// department firestore에 올리는 함수
// 부서, 유저별 타입 설정
interface Department {
  id: string;
  name: string; // 부서 이름
  teams: string[]; // 부서 안에 속해 있는 팀 이름
}
interface User {
  name: string;
  email: string;
  phoneNumber: string;
  departmentId?: string;
  teamId?: string;
}

async function addDepartment(
  name: Department,
  teams: Department,
): Promise<void> {
  try {
    const departmentRef = collection(db, "Department");
    await addDoc(departmentRef, {
      name,
      teams,
    });
    console.log("부서 및 팀 추가 완료");
    alert("부서 및 팀 추가 완료");
  } catch (error) {
    console.error("에러: ", error);
  }
}
async function addUser(user: User): Promise<void> {
  try {
    const userRef = collection(db, "Users");
    await addDoc(userRef, user);
    console.log("유저 등록 완료");
    alert("유저 완료");
  } catch (error) {
    console.error("에러: ", error);
  }
}

// department 조회하는 함수
async function getDepartment() {
  const departmentRef = collection(db, "Department");
  const querySnapshot = await getDocs(departmentRef);
  const departments: Department[] = [];
  querySnapshot.forEach((doc) => {
    departments.push({ id: doc.id, ...doc.data() } as Department);
    console.log(departments);
  });
}
// department selectbox에 넣는 함수
export default function AddInfo() {
  useEffect(() => {
    getDepartment(); // getDepartment 함수 호출
  }, []); // 빈 배열을 넣어 최초 렌더링 시에만 호출되도록 설정

  return <div>addinfo</div>;
}
