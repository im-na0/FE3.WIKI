import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useFetchData } from "../../hooks/Employee/useFetchData";
import { FormDataType } from "../../type/form";
import { Button } from "antd";
import CustomForm from "../common/CustomForm";
import { EditOutlined } from "@ant-design/icons";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";

function MemberDetailInfo() {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const { memberId } = useParams<{ memberId: string }>();
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    DOCUMENT_ID: memberId,
  };
  const userData: FormDataType = useFetchData(fetchDataParams);
  useEffect(() => {
    if (userData) {
      Object.keys(userData).forEach((fieldName) => {
        form.setFieldsValue({ [fieldName]: userData[fieldName] });
      });
    }
  }, [userData]);

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
          <h3>직원 정보 / {memberId}</h3>
          <span className="member-desc">{memberId} 님의 프로필</span>
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
                handleProfileCard();
                form.submit(); // FIXME: 제출 전에 유효성 검사하기
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
