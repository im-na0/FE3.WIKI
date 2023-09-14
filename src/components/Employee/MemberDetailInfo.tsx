import React, { useState, useRef } from "react";
import { CameraFilled } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Button, Divider } from "antd";
import CustomForm from "../common/CustomForm";
import { EditOutlined } from "@ant-design/icons";
import { SELECT_OPTIONS } from "../../constant/member";

function MemberDetailInfo() {
  const { memberId } = useParams();

  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const { required, max, pattern } = CustomForm.useValidate();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [name, setName] = useState("김땡땡");
  const [department, setDepartment] = useState("FE");

  const handleSubmit = () => {
    if (isEditMode) {
      const fieldsValue = form.getFieldsValue();
      setName(fieldsValue.name);
      setDepartment(fieldsValue.department);
    }
    // form.resetFields();
    setIsEditMode(false);
  };
  const imageInput = useRef<HTMLInputElement | null>(null);
  const onCickImageUpload = () => {
    console.log("실행", imageInput);
    imageInput.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      setUploadedFile(selectedFile);
    }
  };

  return (
    <Form
      onFinish={(value) => {
        console.log(value);
        handleSubmit();
      }}
      form={form}
    >
      <div className="member-header">
        <div className="member-title">
          <h3>직원 정보 / {memberId}</h3>
          <span className="member-desc">{memberId} 님의 프로필</span>
        </div>
        <div className="member-btn-area">
          {isEditMode ? (
            <Button type="primary" icon={<EditOutlined />} htmlType="submit">
              Save
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <div className="member-container">
        <div className="memer-profile-area">
          <div className="member-pofile-wrap">
            <label htmlFor="image" className="member-form-profile">
              <img
                id="preview"
                className="profile-img hidden"
                alt="preview"
                src={
                  uploadedFile
                    ? URL.createObjectURL(uploadedFile)
                    : "https://deploy-preview-66--effulgent-axolotl-ab38e8.netlify.app/asset/member3.png"
                }
              />
              {imageInput.current && !imageInput.current.disabled ? (
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraFilled />}
                  onClick={onCickImageUpload}
                ></Button>
              ) : null}
            </label>
            <input
              type="file"
              className="input-file edit"
              id="image"
              accept="image/*"
              style={{ display: "none" }}
              ref={imageInput}
              onChange={handleChange}
              disabled={!isEditMode}
            />
          </div>
          <div className="member-profile-info">
            <div className="title-text">{name}</div>
            <div className="desc-text">{department}</div>
          </div>
        </div>
        <div className="member-info-area">
          <div className="member-info-wrap">
            <Divider orientation="left">기본 정보</Divider>
            <CustomForm.Input
              label="이름"
              name="name"
              rules={[required(), max(20)]}
              readOnly={!isEditMode}
            />
            <CustomForm.Input
              label="이메일"
              name="email"
              readOnly={!isEditMode}
            />
            <CustomForm.Input
              label="전화"
              name="phone"
              readOnly={!isEditMode}
              rules={[
                required(),
                pattern(
                  /^(\d{11}|\d{3}-\d{4}-\d{4})$/,
                  "전화번호는 '-'를 포함해야 합니다.",
                ),
              ]}
            />
            <Divider orientation="left">회사 정보</Divider>
            <CustomForm.Select
              label="부서"
              name="department"
              options={SELECT_OPTIONS.department}
              readOnly={!isEditMode}
              defaultValue="option"
              rules={[required()]}
            />
            <CustomForm.Select
              label="직책"
              name="position"
              options={SELECT_OPTIONS.position}
              defaultValue="option"
              readOnly={!isEditMode}
              rules={[required()]}
            />
            <CustomForm.Select
              label="권한"
              name="access"
              readOnly={!isEditMode}
              defaultValue="option"
              options={SELECT_OPTIONS.access}
            />
          </div>
        </div>
      </div>
    </Form>
  );
}
export default MemberDetailInfo;
