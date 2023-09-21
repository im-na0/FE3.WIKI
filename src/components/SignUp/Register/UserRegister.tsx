import React, { useEffect, useRef } from "react";
import { styled } from "styled-components";
import { Button, Input, Select, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import swal from "sweetalert";
import { MainTitle } from "../Title";
import { SlideCounter, Dot, ActiveDot } from "../Pagination";
import { useNavigation } from "../../../hooks/SignIn/Navigation";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth, storage } from "../../../libs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRecoilState } from "recoil";
import {
  Team,
  selectedPartState,
  selectedPoState,
  selectedTeamState,
  teamState,
  userInfo,
} from "../../../store/sign";
import { SELECT_OPTIONS } from "../../../constant/member";

// 부서 가져오기
const departmentKey = Object.keys(SELECT_OPTIONS.department);
const positionKey = Object.keys(SELECT_OPTIONS.position);

// Teams 정보 가져오기
async function getTeams() {
  const teamRef = collection(db, "Teams");
  const querySnapshot = await getDocs(teamRef);
  const teams: Team[] = [];
  querySnapshot.forEach((doc) => {
    teams.push({ id: doc.id, ...doc.data() } as Team);
  });
  return teams;
}
export default function UserRegister() {
  // 로그인 유저 정보 가져오기
  const user = auth.currentUser;
  const { moveStartRegister, moveEndRegister } = useNavigation();
  const [teamOptions, setTeamOptions] = useRecoilState(teamState);
  const [selectedPart, setSelectedPart] = useRecoilState(selectedPartState);
  const [selectedTeam, setSelectedTeam] = useRecoilState(selectedTeamState);
  const [selectedPosition, setSelectedPosition] =
    useRecoilState(selectedPoState);

  // 기존 부서 저장
  const prevPartmentRef = useRef<string | undefined>(undefined);
  const prevTeamRef = useRef<string | undefined>(selectedTeam);

  //  부서 선택하면 선택 부서 저장
  const handleSelectedPart = (value: string | undefined) => {
    prevPartmentRef.current = selectedPart;
    setSelectedPart(value);
  };

  //  팀 선택하면 선택 팀 저장
  const handleSelectedTeam = (value: string | undefined) => {
    prevTeamRef.current = selectedTeam;
    setSelectedTeam(value);
  };

  // 직급 선택하면 선택 직급 저장
  const handleSelectedPosition = (value: string | undefined) => {
    setSelectedPosition(value);
  };
  useEffect(() => {
    async function fetchTeams() {
      const teams = await getTeams();
      setTeamOptions(teams);
    }
    fetchTeams();
  }, []);

  // 유저 정보 input 값 저장
  const [input, setInput] = useRecoilState(userInfo);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "department") {
      setSelectedPart(value);
    }
    if (name === "team") {
      setSelectedTeam(value);
    }
    if (name === "position") {
      setSelectedPosition(value);
    }
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  // upload 컴포넌트 props 값 => 이미지 업로드
  const props: UploadProps = {
    name: "file",
    customRequest: async ({ file }) => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const uploadFile = file as File;
          const storageRef = ref(
            storage,
            `images/${userUid}/${uploadFile.name}`,
          );
          const snapshot = await uploadBytes(storageRef, uploadFile);
          swal("사진 업로드 완료");
          const downloadURL: string | undefined =
            await getDownloadURL(storageRef);
          setInput((prevInput) => ({
            ...prevInput,
            photo: downloadURL,
          }));
        } else {
          console.error("로그아웃 상태");
          swal("Fail", "로그인부터 해주세요!", "error");
        }
      } catch (error) {
        console.error("업로드 오류: ", error);
      }
    },
    showUploadList: false,
  };

  // firebase에 로그인 uid 이름으로 업로드
  const handleUpload = async () => {
    try {
      if (user) {
        const userUid = user.uid; // uid 가져오기
        const userDB = doc(db, "Users", userUid);
        const newUser = {
          name: input.name,
          email: input.email,
          phone: input.phone,
          department: selectedPart,
          team: selectedTeam,
          position: selectedPosition,
          photo: input.photo,
        };
        const prevTeamName = prevTeamRef.current;
        console.log(prevTeamName);
        console.log(selectedTeam);
        if (prevTeamName !== selectedTeam) {
          if (prevTeamName) {
            const prevTeamQuery = query(
              collection(db, "Teams"),
              where("teamName", "==", prevTeamName),
            );
            const prevTeamQuerySnapshot = await getDocs(prevTeamQuery);
            if (!prevTeamQuerySnapshot.empty) {
              const prevTeamDoc = prevTeamQuerySnapshot.docs[0];
              const prevTeamData = prevTeamDoc.data();
              const updatedUserId = (prevTeamData.userId || []).filter(
                (userId: string) => userId !== userUid,
              );
              await updateDoc(prevTeamDoc.ref, {
                userId: updatedUserId,
              });
              moveEndRegister();
            }
          }
        }
        await setDoc(userDB, newUser);
        const teamDB = collection(db, "Teams");
        const q = query(teamDB, where("teamName", "==", selectedTeam));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const teamDoc = querySnapshot.docs[0];
          const teamData = teamDoc.data();
          const updatedUserId = [...(teamData.userId || []), userUid];
          await updateDoc(teamDoc.ref, {
            userId: updatedUserId,
          });
        } else {
          const teamData = {
            department: selectedPart,
            teamName: selectedTeam,
            userId: [userUid],
          };
          await addDoc(teamDB, teamData);
        }
        // localStorage에 user 정보 올리기
        const userData = {
          newUser: newUser,
          userUid: userUid,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        swal("Success", "업로드 성공", "success");
        moveEndRegister();
      } else {
        console.error("로그아웃 상태");
        swal("Warning", "로그아웃 상태입니다!", "warning");
      }
    } catch (error) {
      console.error("Error: ", error);
      swal("Error", "업로드 실패", "error");
    }
  };
  // 내 정보 수정시 기존 유저 정보 보이게 하기
  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setInput((prevInput) => ({
        ...prevInput,
        ...userData.newUser,
      }));
      setSelectedPart(userData.newUser.department);
      setSelectedTeam(userData.newUser.team);
      setSelectedPosition(userData.newUser.position);
    }
  }, []);
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
              value={input.name} // 기존 유저 이름 정보
            />
          </UserNameCategory>
          <UserEmailCategory>
            <span>이메일</span>
            <Input
              name="email"
              style={{ width: "320px" }}
              placeholder="이메일을 입력해주세요"
              onChange={handleInputChange}
              value={input.email} // 기존 유저 메일 정보
            />
          </UserEmailCategory>
          <UserPhoneCategory>
            <span>휴대폰 번호</span>
            <Input
              name="phone"
              style={{ width: "320px" }}
              placeholder="휴대폰 번호를 입력해주세요"
              onChange={handleInputChange}
              value={input.phone} // 기존 유저 번호 정보
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
              options={departmentKey.map((key) => ({
                label: key,
                value:
                  SELECT_OPTIONS.department[
                    key as keyof typeof SELECT_OPTIONS.department
                  ],
              }))}
              onChange={handleSelectedPart}
              value={selectedPart} // 기존 유저 부서
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
                value: team.teamName,
                label: team.teamName,
              }))}
              onChange={handleSelectedTeam}
              value={selectedTeam} // 기존 유저 팀 정보
            />
          </UserTeamCategory>
          <UserPositionCategory>
            <span>직급</span>
            <Select
              showSearch
              style={{ width: 320 }}
              placeholder="직급을 골라주세요"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={positionKey.map((key) => ({
                label: key,
                value:
                  SELECT_OPTIONS.position[
                    key as keyof typeof SELECT_OPTIONS.position
                  ],
              }))}
              onChange={handleSelectedPosition}
              value={selectedPosition} // 기존 유저 직급 정보
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
  border-radius: 10px;
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
  background-color: #6c63ff;
  font-size: 16px;
  color: #fff;
  font-weight: bold;
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
  color: #fff;
  font-weight: bold;
  background-color: #6c63ff;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;
