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
          src={
            previewUrl ||
            "https://firebasestorage.googleapis.com/v0/b/crew-control-service.appspot.com/o/images%2FDB3F1B92-888C-43B5-9B01-46366541F5AB.jpeg_poxdCijm1ATgMY44b6BsiAGYzVPC%2Fc26Vqo4YWWmF4k%3D_1695064740539?alt=media&token=bc3ce1f2-8c6f-4a29-8629-aae1b388b0d1"
          } // FIXME: 기본 이미지 변경
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
