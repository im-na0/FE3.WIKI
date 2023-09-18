import React, { useRef, useEffect, useState } from "react";
import { CameraFilled } from "@ant-design/icons";
import { Button } from "antd";
interface MemberProfileProps {
  isEditMode: boolean;
  previewUrl: string | null;
  setPreviewUrl: (value: string | null) => void;
  file: File | null;
  setFile: (value: File | null) => void;
}

function MemberProfile({
  isEditMode,
  previewUrl,
  setPreviewUrl,
  file,
  setFile,
}: MemberProfileProps) {
  const imageInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file, setPreviewUrl]);

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
          src={previewUrl || ""} // FIXME: 기본 이미지 변경
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
