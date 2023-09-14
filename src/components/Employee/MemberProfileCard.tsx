import React from "react";
import { CameraFilled } from "@ant-design/icons";
import { Button } from "antd";

interface MemberProfileCardProps {
  uploadedFile: File | null;
  onImageUpload: () => void;
  isEditMode: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function MemberProfileCard({
  uploadedFile,
  onImageUpload,
  isEditMode,
  handleChange,
}: MemberProfileCardProps) {
  return (
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
        {isEditMode && (
          <Button
            type="primary"
            shape="circle"
            icon={<CameraFilled />}
            onClick={onImageUpload}
          ></Button>
        )}
      </label>
      <input
        type="file"
        className="input-file edit"
        id="image"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={!isEditMode}
      />
    </div>
  );
}

export default MemberProfileCard;
