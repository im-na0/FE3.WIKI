import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { storage } from "../../libs/firebase";
import React, { useRef, useState } from "react";
import { CameraFilled } from "@ant-design/icons";
import { Button } from "antd";

function MemberProfile({ isEditMode }: { isEditMode: boolean }) {
  const imageInput = useRef<HTMLInputElement | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onImageUpload = () => {
    console.log("실행", imageInput);
    imageInput.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (!selectedFile) {
      return;
    }
    uploadStorage(selectedFile);
    setUploadedFile(selectedFile);
  };

  const uploadStorage = async (file: File | undefined) => {
    const fileName = file!.name;
    try {
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadImg = uploadBytesResumable(storageRef, file!);

      const snapshot = await uploadImg;
      const url = await getDownloadURL(snapshot.ref);

      console.log(`Uploading ${url}`);
      return url;
    } catch (error) {
      console.error("Error uploading file: ", error);
      throw error;
    }
  };

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
