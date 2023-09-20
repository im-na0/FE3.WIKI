import React, { useState } from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import CustomForm from "../common/CustomForm";
import styled from "styled-components";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";
import { db, storage } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { FormDataType } from "../../type/form";

const COLLECTION_NAME = "Users";

const SumbitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function AddMemberModal({ onCancel }: { onCancel: () => void }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadFile = async () => {
    const name = new Date().getTime() + file!.name;
    const storageRef = ref(storage, `member/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file as File);
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  };

  const handleAdd = async (data: FormDataType) => {
    const imageUrl = await uploadFile();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      photo: imageUrl,
    });
    onCancel(); // 모달창 닫기
    console.log(previewUrl);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // FIXME: 리렌더 안돼서 미리보기가 남아있음
    }
    form.resetFields();
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
