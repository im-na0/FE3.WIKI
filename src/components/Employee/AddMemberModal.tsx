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
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const COLLECTION_NAME = "Users";
  const { uploadStorage, uploadStore, uploading, downloadURL } =
    useUploadData(COLLECTION_NAME);

  const handleAdd = async (data: FormDataType, teamId: string) => {
    setIsLoading(true);
    try {
      if (file) {
        setLoadingMessage("이미지 업로드 중...");
        const uploadedURL = await uploadStorage(file);

        setLoadingMessage("데이터 저장 중...");
        await uploadStore({ ...data, photo: uploadedURL }, teamId);
      }
      setIsLoading(false);
      form.resetFields();
      setPreviewUrl("");
    } catch (error) {
      console.error("handleAdd 오류:", error);
    } finally {
      onCancel();
      setLoadingMessage(null);
    }
  };

  return (
    <>
      <FullScreenSpin message={loadingMessage} />
      <Form
        form={form}
        onFinish={(data) => {
          handleAdd(data, data.teamId);
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
          <Button
            icon={<UserAddOutlined />}
            htmlType="submit"
            type="primary"
            disabled={isLoading}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            Add
          </Button>
        </SumbitBtn>
      </Form>
    </>
  );
}

const FullScreenSpin = ({ message }: { message: string | null }) => {
  return (
    <Spin
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
      spinning={!!message}
    >
      {message && <div>{message}</div>}
    </Spin>
  );
};

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;
