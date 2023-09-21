import React, { useState } from "react";
import { Button, Form } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";
import { useUploadData } from "../../hooks/Employee/useMemberMutaion";
import { FormDataType } from "../../type/form";

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function AddMemberModal({ onCancel }: { onCancel: () => void }) {
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const COLLECTION_NAME = "Users";
  const { uploadStorage, uploadStore, uploading, downloadURL } =
    useUploadData(COLLECTION_NAME);

  const handleAdd = async (data: FormDataType) => {
    if (file) {
      await uploadStorage(file);
      if (downloadURL) {
        await uploadStore({ ...data, photo: downloadURL });
        onCancel();
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        form.resetFields();
      }
    }
  };

  return (
    <Form
      onFinish={(data) => {
        handleAdd(data);
      }}
      form={form}
    >
      <MemberProfile
        isEditMode={isEditMode}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        file={file}
        setFile={setFile}
      />
      <MemberForm isEditMode={isEditMode} />
      <SumbitBtn>
        <Button icon={<UserAddOutlined />} htmlType="submit" type="primary">
          Add
        </Button>
      </SumbitBtn>
    </Form>
  );
}
