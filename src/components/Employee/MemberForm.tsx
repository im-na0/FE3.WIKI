import React from "react";
import { Divider } from "antd";
import CustomForm from "../common/CustomForm";
import { SELECT_OPTIONS } from "../../constant/member";
import MemberProfile from "./MemberProfile";
import styled from "styled-components";

function MemberForm({ isEditMode }: { isEditMode: boolean }) {
  const { required, max, pattern } = CustomForm.useValidate();
  return (
    <>
      {/*<MemberProfile isEditMode={isEditMode} />*/}
      <Divider orientation="left">기본 정보</Divider>
      <CustomForm.Input
        label="이름"
        name="name"
        rules={[required(), max(20)]}
        readOnly={!isEditMode}
      />
      <CustomForm.Input label="이메일" name="email" readOnly={!isEditMode} />
      <CustomForm.Input
        label="전화"
        name="phone"
        readOnly={!isEditMode}
        rules={[
          required(),
          pattern(
            /^(\d{11}|\d{3}-\d{4}-\d{4})$/,
            "전화번호는 '-'를 포함해야 합니다.",
          ),
        ]}
      />
      <Divider orientation="left">회사 정보</Divider>
      <CustomForm.Select
        label="부서"
        name="department"
        options={SELECT_OPTIONS.department}
        readOnly={!isEditMode}
        defaultValue="option"
        rules={[required()]}
      />
      <CustomForm.Select
        label="직책"
        name="position"
        options={SELECT_OPTIONS.position}
        defaultValue="option"
        readOnly={!isEditMode}
        rules={[required()]}
      />
      <CustomForm.Select
        label="권한"
        name="access"
        readOnly={!isEditMode}
        defaultValue="option"
        options={SELECT_OPTIONS.access}
      />
    </>
  );
}

export default MemberForm;
