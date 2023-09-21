import React, { useState } from "react";
import { Button, message, Spin } from "antd";
import { serverTimestamp } from "firebase/firestore";
import TeamForm from "./TeamForm";
import { FormDataType } from "../../../type/form";
import CustomForm from "../../common/CustomForm";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { selectedUserIdsState } from "../../../store/member";
import { useUploadData } from "../../../hooks/Employee/useMemberMutaion";
import TeamMemberSelect from "./TeamMemberSelect";
import MemberProfile from "../MemberProfile";

export default function AddTeamModal({ onCancel }: { onCancel: () => void }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] =
    useRecoilState(selectedUserIdsState);

  const { uploadStorage, uploadStore, uploading } = useUploadData("Teams");

  const handleAdd = async (data: FormDataType) => {
    if (file) {
      try {
        const uploadedUrl = await uploadStorage(file);
        if (uploadedUrl) {
          await uploadStore({
            ...data,
            photo: uploadedUrl,
            userId: selectedUserIds,
            createdAt: serverTimestamp(),
          });
          onCancel();
          form.resetFields();
          setSelectedUserIds([]);
          message.success("팀이 생성되었습니다!");
        }
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <>
      {uploading && <FullScreenSpin spinning={uploading}></FullScreenSpin>}
      <Form
        onFinish={(data) => {
          console.log(data);
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
    </>
  );
}

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FullScreenSpin = styled(Spin)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;
