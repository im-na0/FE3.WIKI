import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { Button, Input, Select, Upload, message } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { MainTitle } from "../Title";
import { SlideCounter, Dot, ActiveDot } from "../Pagination";
import { useNavigation } from "../Navigation";
import { motion } from "framer-motion";
import { addDoc, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../../libs/firebase";
import { useNavigate } from "react-router-dom";

// department firestore에 올리는 함수
// 부서, 팀별 타입 설정
interface Department {
  id: string;
  name: string; // 부서 이름
  teams: string[]; // 부서 안에 속해 있는 팀 이름
}
interface Team {
  id: string; // Team Name
  member: string; // Team 속해 있는 멤버
}
const UserNameCategory = styled.div`
  margin: 20px 20px;
  display: flex;
  flex-direction: column;
`;
const UserDepartmentCategory = styled(UserNameCategory)``;
const UserTeamCategory = styled(UserNameCategory)``;

// Departments Collection 진입
async function getDepartments() {
  const departmentRef = collection(db, "Department");
  const querySnapshot = await getDocs(departmentRef);
  const departments: Department[] = [];
  querySnapshot.forEach((doc) => {
    departments.push({ id: doc.id, ...doc.data() } as Department);
    console.log(departments);
  });
  return departments;
}
// Departments ID => Teams Collection 진입
async function getTeams(selectedPart: string | undefined) {
  if (!selectedPart) {
    return [];
  }
  const teamsRef = collection(db, "Department", selectedPart, "Teams"); // "개발"은 나중에 동적으로 바꿔줌
  const querySnapshot = await getDocs(teamsRef);
  const teams: Team[] = [];
  querySnapshot.forEach((doc) => {
    teams.push({ id: doc.id, ...doc.data() } as Team);
    console.log(teams);
  });
  return teams;
}
// // department selectbox에 넣는 함수
export default function AddInfo() {
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]); // firebase에 있는 부서 옵션 저장
  const [teamOptions, setTeamOptions] = useState<Team[]>([]); // firebase에 있는 team 옵션 저장
  const [selectedPart, setSelectedPart] = useState<string | undefined>(
    undefined,
  );
  const handleSelectedPart = (value: string | undefined) => {
    setSelectedPart(value);
  };
  useEffect(() => {
    async function fetchDepartment() {
      const departments = await getDepartments();
      setDepartmentOptions(departments);
    }
    fetchDepartment();
  }, []);
  useEffect(() => {
    async function fetchTeam() {
      const teams = await getTeams(selectedPart);
      setTeamOptions(teams);
    }
    fetchTeam();
  }, [selectedPart]);
  return (
    <>
      <UserDepartmentCategory>
        <span>소속 부서</span>
        <Select
          showSearch
          style={{ width: 320 }}
          placeholder="소속 부서를 골라주세요"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={departmentOptions.map((department) => ({
            value: department.id,
            label: department.name,
          }))}
          onChange={handleSelectedPart}
        />
      </UserDepartmentCategory>
      <UserTeamCategory>
        <span>소속 팀</span>
        <Select
          showSearch
          style={{ width: 320 }}
          placeholder="소속팀을 골라주세요"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={teamOptions.map((team) => ({
            value: team.id,
            label: team.id,
          }))}
        />
      </UserTeamCategory>
    </>
  );
}
