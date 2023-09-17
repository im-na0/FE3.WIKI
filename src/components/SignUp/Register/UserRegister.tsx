import React, { useState } from "react";
import { styled } from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Select, Upload, message } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { MainTitle } from "../Title";
import { SlideCounter, Dot, ActiveDot } from "../Pagination";
import { useNavigation } from "../Navigation";
import { motion } from "framer-motion";

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
const UserCompanyCategory = styled(UserNameCategory)``;
const UserRankCategory = styled(UserNameCategory)``;
const UserImageCategory = styled(UserNameCategory)``;
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
export default function UserRegister() {
  const { moveStartRegister, moveEndRegister } = useNavigation();
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
              style={{ width: "320px" }}
              placeholder="사용하실 이름을 입력해주세요"
            />
          </UserNameCategory>
          <UserCompanyCategory>
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
              options={[
                {
                  value: "1",
                  label: "FE팀",
                },
                {
                  value: "2",
                  label: "BE팀",
                },
                {
                  value: "3",
                  label: "기획팀",
                },
                {
                  value: "4",
                  label: "디자인팀",
                },
                {
                  value: "5",
                  label: "놀고먹는팀",
                },
              ]}
            />
          </UserCompanyCategory>
          <UserRankCategory>
            <span>직급</span>
            <Input
              style={{ width: "320px" }}
              placeholder="맡으신 직급을 입력해주세요"
            />
          </UserRankCategory>
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
            <SubmitBtn onClick={moveEndRegister}>완료</SubmitBtn>
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
