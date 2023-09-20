import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchData } from "../../hooks/Employee/useFetchData";
import { FormDataType } from "../../type/form";
import { Button, message } from "antd";
import CustomForm from "../common/CustomForm";
import { EditOutlined, UnorderedListOutlined } from "@ant-design/icons";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";
import {
  useUpdateData,
  useUploadStorage,
  useDeleteStorage,
} from "../../hooks/Employee/useMemberMutaion";

function MemberDetailInfo() {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [file, setFile] = useState<File | null>(null); // file 관리
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    DOCUMENT_ID: memberId,
  };
  const userData: FormDataType | null = useFetchData(fetchDataParams);
  const [cardName, setCardName] = useState(userData.name);
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
        setCardName(userData.name);
      });
    }
  }, [userData]);

  const handleUpdate = async () => {
    try {
      const { uploadStorage } = useUploadStorage();
      const { deleteStorage } = useDeleteStorage();
      const { updateData } = useUpdateData({ COLLECTION_NAME: "Users" });
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
          <span className="member-desc">{userData?.name} 님의 프로필</span>
        </div>
        <div className="member-btn-area">
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => {
              navigate(-1);
            }}
          >
            목록
          </Button>
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
            <MemberForm isEditMode={isEditMode} />
          </div>
        </div>
      </div>
    </Form>
  );
}
export default MemberDetailInfo;
