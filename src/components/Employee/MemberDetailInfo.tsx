import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import CustomForm from "../common/CustomForm";
import { EditOutlined } from "@ant-design/icons";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";

function MemberDetailInfo() {
  const { memberId } = useParams();

  const Form = CustomForm.Form;
  const [form] = Form.useForm();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // 프로필 카드 상태 초기화
  const [name, setName] = useState("김땡땡");
  const [department, setDepartment] = useState("FE");

  const handleProfileCard = () => {
    if (isEditMode) {
      const fieldsValue = form.getFieldsValue();
      setName(fieldsValue.name);
      setDepartment(fieldsValue.department);
    }
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
          <MemberProfile isEditMode={isEditMode} />
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
