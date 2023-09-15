import React, { useState } from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import CustomForm from "../common/CustomForm";
import styled from "styled-components";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";
import { db } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import { UploadForm } from "../../type/form";

const COLLECTION_NAME = "Users";

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function AddMemberModal({ onCancel }: { onCancel: () => void }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);

  const handleAdd = async (data: UploadForm) => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
    });
    console.log("Document written with ID: ", docRef.id);
    onCancel(); // 모달창 닫기
    form.resetFields();
  };

  return (
    <Form
      onFinish={(data) => {
        console.log(data);
        handleAdd(data);
      }}
      form={form}
    >
      <MemberProfile isEditMode={isEditMode} />
      <MemberForm isEditMode={isEditMode} />
      <SumbitBtn>
        <Button icon={<UserAddOutlined />} htmlType="submit" type="primary">
          Add
        </Button>
      </SumbitBtn>
    </Form>
  );
}
