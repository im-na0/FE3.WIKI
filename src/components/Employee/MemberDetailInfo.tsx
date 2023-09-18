import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchData } from "../../hooks/Employee/useFetchData";
import { FormDataType } from "../../type/form";
import { Button } from "antd";
import CustomForm from "../common/CustomForm";
import { EditOutlined } from "@ant-design/icons";
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
  const { memberId } = useParams<{ memberId: string }>();
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    DOCUMENT_ID: memberId,
  };
  const [file, setFile] = useState<File | null>(null);

  const userData: FormDataType = useFetchData(fetchDataParams);
  useEffect(() => {
    if (userData) {
      Object.keys(userData).forEach((fieldName) => {
        form.setFieldsValue({ [fieldName]: userData[fieldName] });
        if (fieldName === "photo") {
          setPreviewUrl(userData[fieldName as string]);
        }
      });
    }
  }, [userData]);

  const { updateData } = useUpdateData(fetchDataParams);
  const { uploadStorage } = useUploadStorage();
  const { deleteStorage } = useDeleteStorage();

  const handleUpdate = async () => {
    const fieldsValue = form.getFieldsValue();
    if (file != null) {
      const uploadedPhotoUrl = await uploadStorage(file);
      fieldsValue.photo = uploadedPhotoUrl;
      console.log(fieldsValue);
    }
    if (memberId != null) {
      if (userData.photo) {
        deleteStorage(userData.photo);
      }
      updateData(memberId, fieldsValue);
    }
    handleProfileCard();
  };

  const [name, setName] = useState("김땡땡");
  const [department, setDepartment] = useState("FE");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfileCard = () => {
    if (!isEditMode) {
      return;
    }
    const fieldsValue = form.getFieldsValue();
    setName(fieldsValue.name);
    setDepartment(fieldsValue.department);
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
          <h3>직원 정보 / {userData.name}</h3>
          <span className="member-desc">{userData.name} 님의 프로필</span>
        </div>
        <div className="member-btn-area">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              toggleEditMode();
              if (isEditMode) {
                const formValues = form.getFieldsValue();
                console.log(formValues);
                handleUpdate();
                form.submit();
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
            <div className="title-text">{name}</div>
            <div className="desc-text">{department}</div>
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
