import React, { useRef, useState } from "react";
import { CameraFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useRecoilState } from "recoil";
import { uploadFileState } from "../../store/member";

function MemberProfile({ isEditMode }: { isEditMode: boolean }) {
  const [file, setFile] = useRecoilState(uploadFileState);

  const imageInput = useRef<HTMLInputElement | null>(null);
  const onImageUpload = () => {
    imageInput.current?.click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (!selectedFile) {
      return;
    }
    setFile(selectedFile);
  };

  return (
    <div className="member-pofile-wrap">
      <label htmlFor="image" className="member-form-profile">
        <img
          id="preview"
          className="profile-img hidden"
          alt="preview"
          src={
            file
              ? URL.createObjectURL(file)
              : "https://deploy-preview-66--effulgent-axolotl-ab38e8.netlify.app/asset/member3.png"
          } // FIXME: default 이미지 변경, revoke url
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
        id="image"
        accept="image/*"
        style={{ display: "none" }}
        ref={imageInput}
        onChange={handleChange}
        disabled={!isEditMode}
      />
    </div>
  );
}

export default MemberProfile;
