import React from "react";
import { Divider } from "antd";
import CustomForm from "../common/CustomForm";
import { userInputs, userSelect } from "../../data/formSource";

function MemberForm({ isEditMode }: { isEditMode: boolean }) {
  return (
    <>
      <Divider orientation="left">기본 정보</Divider>
      {userInputs.map((input) => (
        <CustomForm.Input
          key={input.name}
          label={input.label}
          name={input.name}
          rules={input.rules}
          readOnly={!isEditMode}
        />
      ))}
      <Divider orientation="left">회사 정보</Divider>
      {userSelect.map((select) => (
        <CustomForm.Select
          key={select.name}
          label={select.label}
          name={select.name}
          defaultValue={select.defaultValue}
          options={select.options}
          rules={select.rules}
          readOnly={!isEditMode}
        />
      ))}
    </>
  );
}

export default MemberForm;
