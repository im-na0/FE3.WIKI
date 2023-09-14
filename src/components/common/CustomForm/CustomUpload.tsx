import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { Upload, message, Form } from "antd";
import React, { useState } from "react";
import { RcFile } from "antd/lib/upload";

interface Props {
  name: string;
}

export default function CustomUpload({ name }: Props) {
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const customUploadButton = (
    <div>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Profile</p>
    </div>
  );

  return (
    <Form.Item name={name}>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        beforeUpload={handleUpload}
        onPreview={onPreview}
        accept="image/png, image/jpeg"
        maxCount={1}
        onChange={({ fileList }) => setFileList(fileList)}
      >
        {fileList.length >= 1 ? null : customUploadButton}
      </Upload>
    </Form.Item>
  );
}
