import React, { useState } from "react";
import { Button, message } from "antd";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../libs/firebase";
import TeamForm from "./TeamForm";
import { FormDataType } from "../../type/form";
import CustomForm from "../common/CustomForm";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { selectedUserIdsState } from "../../store/member";

const COLLECTION_NAME = "Teams";

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function AddTeamModal({ onCancel }: { onCancel: () => void }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedUserIds, setSelectedUserIds] =
    useRecoilState(selectedUserIdsState);

  const handleAdd = async (data: FormDataType) => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      userId: selectedUserIds,
    });
    onCancel();
    form.resetFields();
    message.success("팀이 생성되었습니다!");

    setSelectedUserIds([]);
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
      <SumbitBtn>
        <Button htmlType="submit" type="primary">
          Add
        </Button>
      </SumbitBtn>
    </Form>
  );
}
