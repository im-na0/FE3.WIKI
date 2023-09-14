import React from "react";
import { Divider } from "antd";
import CustomForm from "../common/CustomForm";
import CustomUpload from "../common/CustomForm/CustomUpload";
import { FormInstance } from "antd/es/form/Form";
import { SELECT_OPTIONS } from "../../constant/member";
import styled from "styled-components";

const FormContainer = styled.div`
  padding: 1.2rem;
`;
const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const FormColProfile = styled.div`
  flex: 0 1;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
const FormColInfo = styled.div`
  flex: 1;
`;
const FormColSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export default function AddMemberForm({ form }: { form: FormInstance }) {
  const { required, max, pattern } = CustomForm.useValidate();

  return (
    <FormContainer>
      <Divider orientation="left">기본 정보</Divider>
      <FormRow>
        <FormColProfile>
          <CustomUpload name="image_url" />
        </FormColProfile>
        <FormColInfo>
          <CustomForm.Input
            label="이름"
            name="name"
            rules={[required(), max(20)]}
          />
          <CustomForm.Input label="이메일" name="email" disabled />
          <CustomForm.Input
            label="전화"
            name="phone"
            rules={[
              required(),
              pattern(
                /^(\d{11}|\d{3}-\d{4}-\d{4})$/,
                "전화번호는 '-'를 포함해야 합니다.",
              ),
            ]}
          />
        </FormColInfo>

        <Divider orientation="left">회사 정보</Divider>
        <FormColSelect>
          <CustomForm.Select
            label="부서"
            name="department"
            options={SELECT_OPTIONS.department}
            defaultValue="option"
            rules={[required()]}
          />
          <CustomForm.Select
            label="직책"
            name="position"
            options={SELECT_OPTIONS.position}
            defaultValue="option"
            rules={[required()]}
          />
          <CustomForm.Select
            label="권한"
            name="access"
            defaultValue="option"
            options={SELECT_OPTIONS.access}
          />
        </FormColSelect>
      </FormRow>
    </FormContainer>
  );
}
