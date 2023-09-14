import React from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import CustomForm from "../common/CustomForm";
import AddMemberForm from "./AddMemberForm";
import styled from "styled-components";

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function AddMemberModal({ onCancel }: { onCancel: () => void }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();

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
      <AddMemberForm form={form} />
      <SumbitBtn>
        <Button icon={<UserAddOutlined />} htmlType="submit" type="primary">
          Add
        </Button>
      </SumbitBtn>
    </Form>
  );
}
