import React, { useState } from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import CustomForm from "../common/CustomForm";
import styled from "styled-components";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function AddMemberModal({ onCancel }: { onCancel: () => void }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);

  const handleSubmit = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Form
      onFinish={(value) => {
        console.log(value);
        handleSubmit();
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
