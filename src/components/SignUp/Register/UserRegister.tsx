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
import { db, auth } from "../../../libs/firebase";
import { useNavigate } from "react-router-dom";
const props: UploadProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

interface Department {
  id: string;
  name: string; // 부서 이름
  teams: string[]; // 부서 안에 속해 있는 팀 이름
}
interface Team {
  id: string; // Team Name
  member: string; // Team 속해 있는 멤버
}

const Container = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 80px;
`;
const UserInfoContainer = styled.div`
  border: 1px solid black;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: start;
  span {
    font-weight: 500;
  }
`;
const UserNameCategory = styled.div`
  margin: 20px 20px;
  display: flex;
  flex-direction: column;
`;
const UserEmailCategory = styled(UserNameCategory)``;
const UserPhoneCategory = styled(UserNameCategory)``;
const UserTeamCategory = styled(UserNameCategory)``;
const UserPositionCategory = styled(UserNameCategory)``;
const UserImageCategory = styled(UserNameCategory)``;
const UserDepartmentCategory = styled(UserNameCategory)``;
const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px;
  height: 30px;
`;
const BackBtn = styled.button`
  border: 1px solid black;
  width: 60px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  &:hover {
    background-color: #000;
    color: #fff;
    transform: translateX(-5px);
  }
`;
const SubmitBtn = styled.button`
  border: 1px solid black;
  width: 240px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;
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
  const teamsRef = collection(db, "Department", selectedPart, "Teams");
  const querySnapshot = await getDocs(teamsRef);
  const teams: Team[] = [];
  querySnapshot.forEach((doc) => {
    teams.push({ id: doc.id, ...doc.data() } as Team);
    console.log(teams);
  });
  return teams;
}
export default function UserRegister() {
  const storeUid = localStorage.getItem("uid"); // uid 가져오기
  const { moveStartRegister, moveEndRegister } = useNavigation();
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]); // firebase에 있는 부서 옵션 저장
  const [teamOptions, setTeamOptions] = useState<Team[]>([]); // firebase에 있는 team 옵션 저장
  const [selectedPart, setSelectedPart] = useState<string | undefined>(
    undefined,
  );
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
    undefined,
  );
  const handleSelectedPart = (value: string | undefined) => {
    setSelectedPart(value);
  };
  const handleSelectedTeam = (value: string | undefined) => {
    setSelectedTeam(value);
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
  const [input, setInput] = useState({
    name: "",
    email: "",
    phonenumber: "",
    department: "",
    team: "",
    position: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "department") {
      setSelectedPart(value);
    }
    if (name === "team") {
      setSelectedTeam(value);
    }
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };
  const handleUpload = async () => {
    try {
      if (storeUid) {
        const userDB = doc(db, "Users", storeUid);
        const newUser = {
          name: input.name,
          email: input.email,
          phonenumber: input.phonenumber,
          department: selectedPart,
          team: selectedTeam,
          position: input.position,
        };
        const docRef = await setDoc(userDB, newUser);
        alert("업로드 성공");
        moveEndRegister();
      } else {
        console.error("로그아웃 상태");
        alert("로그아웃 상태입니다");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("업로드 실패");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <MainTitle>회원님의 정보를 입력해주세요!</MainTitle>
        <UserInfoContainer>
          <UserNameCategory>
            <span>이름</span>
            <Input
              name="name"
              style={{ width: "320px" }}
              placeholder="사용하실 이름을 입력해주세요"
              onChange={handleInputChange}
            />
          </UserNameCategory>
          <UserEmailCategory>
            <span>이메일</span>
            <Input
              name="email"
              style={{ width: "320px" }}
              placeholder="이메일을 입력해주세요"
              onChange={handleInputChange}
            />
          </UserEmailCategory>
          <UserPhoneCategory>
            <span>휴대폰 번호</span>
            <Input
              name="phonenumber"
              style={{ width: "320px" }}
              placeholder="휴대폰 번호를 입력해주세요"
              onChange={handleInputChange}
            />
          </UserPhoneCategory>
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
              onChange={handleSelectedTeam}
            />
          </UserTeamCategory>
          <UserPositionCategory>
            <span>직급</span>
            <Input
              name="position"
              style={{ width: "320px" }}
              placeholder="맡으신 직급을 입력해주세요"
              onChange={handleInputChange}
            />
          </UserPositionCategory>
          <UserImageCategory>
            <span>프로필 사진</span>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>프로필 사진 업로드</Button>
            </Upload>
          </UserImageCategory>
          <BtnContainer>
            <BackBtn onClick={moveStartRegister}>
              <ArrowLeftOutlined />
            </BackBtn>
            <SubmitBtn onClick={handleUpload}>완료</SubmitBtn>
          </BtnContainer>
        </UserInfoContainer>
        <SlideCounter>
          <Dot />
          <ActiveDot />
          <Dot />
        </SlideCounter>
      </Container>
    </motion.div>
  );
}
