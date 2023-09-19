import React from "react";
import { Divider } from "antd";
import CustomForm from "../common/CustomForm";
import { teamInputs, teamSelect } from "../../data/formSource";
import { useRecoilState } from "recoil";
import { selectedUserIdsState } from "../../store/member";
import TeamMemberSelect from "./TeamMemberSelect";

function TeamForm({ isEditMode }: { isEditMode: boolean }) {
  const [selectedUserIds, setSelectedUserIds] =
    useRecoilState(selectedUserIdsState);

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
      <TeamMemberSelect
        onChange={(userIds: string[]) => setSelectedUserIds(userIds)}
      />
    </>
  );
}

export default TeamForm;
