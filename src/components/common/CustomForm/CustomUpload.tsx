import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { Upload, message, Form } from "antd";
import React, { useState } from "react";
import { RcFile } from "antd/lib/upload";

interface Props {
  name: string;
}

export default function CustomUpload({ name }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (data) => {
      if (typeof data.target?.result === "string") {
        console.log(data.target?.result);
        setImageUrl(data.target?.result); // 미리보기를 위한 *임시 url*
      }
    };
    reader.readAsDataURL(file);
    // prevent upload
    return false;
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

  const CustomItemRender = ({ file, fileList }: any) => {
    return (
      <div className="custom-item-renderer">
        <img src={fileList.url} alt={file.name} />
        <div className="buttons flex mt-1 ">
          <button>View</button>
          <button>Delete</button>
        </div>
      </div>
    );
  };

  return (
    <Form.Item name={name}>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        beforeUpload={handleUpload}
        onPreview={onPreview}
        accept="image/png, image/jpeg"
        maxCount={1}
        itemRender={CustomItemRender}
      >
        {imageUrl ? (
          <div className="ant-upload-list-item-container">
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          </div>
        ) : (
          customUploadButton
        )}
      </Upload>
    </Form.Item>
  );
}
