import React, { useState } from "react";
import { Button, Form, Spin } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";
import { useUploadData } from "../../hooks/Employee/useMemberMutaion";
import { FormDataType } from "../../type/form";

export default function AddMemberModal({ onCancel }: { onCancel: () => void }) {
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const COLLECTION_NAME = "Users";
  const { uploadStorage, uploadStore, uploading, downloadURL } =
    useUploadData(COLLECTION_NAME);

  const handleAdd = async (data: FormDataType, teamId: string) => {
    if (file) {
      await uploadStorage(file);
      console.log(teamId);
      if (downloadURL) {
        await uploadStore({ ...data, photo: downloadURL }, teamId);
        onCancel();
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        form.resetFields();
      }
    }
  };

  return (
    <>
      {uploading && <FullScreenSpin spinning={uploading}></FullScreenSpin>}
      <Form
        form={form}
        onFinish={(data) => {
          const [teamName, teamId] = data.team.split("|");
          console.log(data, teamName, teamId);
          handleAdd({ ...data, team: teamName, teamId: teamId }, teamId);
        }}
      >
        <MemberProfile
          isEditMode={isEditMode}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          file={file}
          setFile={setFile}
        />
        <MemberForm isEditMode={isEditMode} form={form} />
        <SumbitBtn>
          <Button icon={<UserAddOutlined />} htmlType="submit" type="primary">
            Add
          </Button>
        </SumbitBtn>
      </Form>{" "}
    </>
  );
}

const FullScreenSpin = styled(Spin)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;
