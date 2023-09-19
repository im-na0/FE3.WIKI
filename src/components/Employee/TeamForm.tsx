import React from "react";
import { Divider } from "antd";
import CustomForm from "../common/CustomForm";
import { teamInputs, teamSelect } from "../../data/formSource";
import { useRecoilState } from "recoil";
import { formDataState, selectedUserIdsState } from "../../store/member";
import UserSelect from "./MemberSelect";

function TeamForm({ isEditMode }: { isEditMode: boolean }) {
  const [data, setData] = useRecoilState(formDataState);
  const [selectedUserIds, setSelectedUserIds] =
    useRecoilState(selectedUserIdsState);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    <>
      <Divider orientation="left">기본 정보</Divider>
      {teamInputs.map((input) => (
        <CustomForm.Input
          key={input.name}
          label={input.label}
          name={input.name || ""}
          rules={input.rules}
          readOnly={!isEditMode}
          onChange={handleInput}
        />
      ))}{" "}
      {teamSelect.map((select) => (
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
      <UserSelect
        onChange={(userIds: string[]) => setSelectedUserIds(userIds)}
      />
    </>
  );
}

export default TeamForm;
