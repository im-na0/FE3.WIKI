import React, { useState } from "react";
import { Button, message } from "antd";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, auth } from "../../../libs/firebase";
import TeamForm from "./TeamForm";
import { FormDataType } from "../../../type/form";
import CustomForm from "../../common/CustomForm";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { selectedUserIdsState } from "../../../store/member";
import TeamMemberSelect from "./TeamMemberSelect";

const COLLECTION_NAME = "Teams";

export default function AddTeamModal({ onCancel }: { onCancel: () => void }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedUserIds, setSelectedUserIds] =
    useRecoilState(selectedUserIdsState);

  const handleAdd = async (data: FormDataType) => {
    const user = auth.currentUser;
    if (user) {
      const userUid = user.uid;
      await setDoc(doc(db, COLLECTION_NAME, userUid), {
        ...data,
        userId: selectedUserIds,
        createdAt: serverTimestamp(),
      });
      onCancel();
      form.resetFields();
      setSelectedUserIds([]);
      message.success("팀이 생성되었습니다!");

      setSelectedUserIds([]);
    }
  };

  return (
    <Form
      onFinish={(data) => {
        console.log(data);
        handleAdd(data);
      }}
      form={form}
    >
      <TeamForm isEditMode={isEditMode} />
      <TeamMemberSelect
        onChange={(userIds: string[]) => setSelectedUserIds(userIds)}
      />
      <SumbitBtn>
        <Button htmlType="submit" type="primary">
          Add
        </Button>
      </SumbitBtn>
    </Form>
  );
}

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;
