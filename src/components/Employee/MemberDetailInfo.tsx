import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchData } from "../../hooks/Employee/useFetchData";
import { FormDataType } from "../../type/form";
import { Button, message } from "antd";
import CustomForm from "../common/CustomForm";
import { EditOutlined } from "@ant-design/icons";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";
import {
  useUpdateData,
  useUploadStorage,
  useDeleteStorage,
} from "../../hooks/Employee/useMemberMutaion";
import TeamForm from "./TeamForm";

function MemberDetailInfo({ collectionName }: { collectionName: string }) {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { memberId, teamId } = useParams<{
    memberId: string;
    teamId: string;
  }>();
  const fetchDataParams = {
    COLLECTION_NAME: collectionName,
    DOCUMENT_ID: memberId || teamId,
  };
  const userData: FormDataType | null = useFetchData(fetchDataParams);
  const [cardName, setCardName] = useState(userData.name || userData.teamName);
  const [cardDepartment, setCardDepartment] = useState(userData.photo);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (userData) {
      Object.keys(userData).forEach((fieldName) => {
        form.setFieldsValue({ [fieldName]: userData[fieldName] });
        if (fieldName === "photo") {
          setPreviewUrl(userData[fieldName as string]);
        }
        setCardDepartment(userData.department);
        setCardName(userData.name || userData.teamName);
      });
    }
  }, [userData]);

  console.log(cardName);

  const handleUpdate = async () => {
    try {
      const { uploadStorage } = useUploadStorage();
      const { deleteStorage } = useDeleteStorage();
      const { updateData } = useUpdateData({ COLLECTION_NAME: collectionName });
      const fieldsValue = form.getFieldsValue();

      if (file) {
        const downloadURL = await uploadStorage(file);
        fieldsValue.photo = downloadURL || fieldsValue.photo!;
        await deleteStorage(userData.photo!);
      } else {
        fieldsValue.photo = previewUrl || fieldsValue.photo;
      }

      if (memberId) {
        await updateData(memberId, fieldsValue);
      }

      handleProfileCard();
    } catch (error) {
      console.error("Error updating member:", error);
      message.error("데이터 업데이트 중 오류가 발생했습니다");
    }
  };

  const handleProfileCard = () => {
    if (!isEditMode) {
      return;
    }
    const fieldsValue = form.getFieldsValue();
    setCardName(fieldsValue.name);
    setCardDepartment(fieldsValue.department);
  };
  const toggleEditMode = () => {
    setIsEditMode((prevIsEditMode) => {
      return !prevIsEditMode;
    });
  };

  return (
    <Form form={form}>
      <div className="member-header">
        <div className="member-title">
          <h3>직원 정보</h3>
          <span className="member-desc">
            {userData?.name
              ? `${userData.name} 님의 프로필`
              : `${userData.teamName} 팀 프로필`}
          </span>
        </div>
        <div className="member-btn-area">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              toggleEditMode();
              if (isEditMode) {
                handleUpdate();
              }
            }}
          >
            {isEditMode ? "Save" : "Edit"}
          </Button>
        </div>
      </div>
      <div className="member-container">
        <div className="memer-profile-area">
          <MemberProfile
            isEditMode={isEditMode}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            file={file}
            setFile={setFile}
          />
          <div className="member-profile-info">
            <div className="title-text">{cardName}</div>
            <div className="desc-text">{cardDepartment}</div>
          </div>
        </div>
        <div className="member-info-area">
          <div className="member-info-wrap">
            {memberId ? (
              <MemberForm isEditMode={isEditMode} />
            ) : teamId ? (
              <TeamForm isEditMode={isEditMode} />
            ) : null}
          </div>
        </div>
      </div>
    </Form>
  );
}
export default MemberDetailInfo;
