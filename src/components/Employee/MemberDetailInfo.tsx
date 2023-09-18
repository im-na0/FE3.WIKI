import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchData } from "../../hooks/Employee/useFetchData";
import { FormDataType } from "../../type/form";
import { Button, message } from "antd";
import CustomForm from "../common/CustomForm";
import { EditOutlined } from "@ant-design/icons";
import MemberForm from "./MemberForm";
import MemberProfile from "./MemberProfile";
import {
  useUpdateData,
  useUploadStorage,
  useDeleteStorage,
} from "../../hooks/Employee/useMemberMutaion";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../libs/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function MemberDetailInfo() {
  const Form = CustomForm.Form;
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [file, setFile] = useState<File | null>(null); // file 관리
  const { memberId } = useParams<{ memberId: string }>();
  const fetchDataParams = {
    COLLECTION_NAME: "Users",
    DOCUMENT_ID: memberId,
  };
  const userData: FormDataType | null = useFetchData(fetchDataParams);

  useEffect(() => {
    if (userData) {
      Object.keys(userData).forEach((fieldName) => {
        form.setFieldsValue({ [fieldName]: userData[fieldName] });
        if (fieldName === "photo") {
          setPreviewUrl(userData[fieldName as string]);
        }
      });
    }
  }, [userData]);

  const uploadStorage = async (file: File) => {
    const fileName = new Date().getTime() + file!.name;
    try {
      const storageRef = ref(storage, `member/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("스토리지 업로드 성공!");
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file: ", error);
      message.error("파일 업로드 중 오류가 발생했습니다 ");
    }
  };

  const deleteStorage = async (src: string) => {
    try {
      await deleteObject(ref(storage, src));
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error("파일 삭제 중 오류가 발생했습니다 ");
    }
  };

  const updateData = async (id: string, data: FormDataType) => {
    try {
      console.log(data);
      await setDoc(doc(db, "User", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      console.log("스토어 업로드 성공!");
    } catch (error) {
      console.error("Error updating member: ", error);
      message.error("데이터 업데이트 중 오류가 발생했습니다 ");
    }
  };

  const handleUpdate = async () => {
    const fieldsValue = form.getFieldsValue();
    if (file != null) {
      const downloadURL = await uploadStorage(file);
      fieldsValue.photo = downloadURL ? downloadURL : fieldsValue.photo;
      console.log(downloadURL);
    }
    if (userData && userData.photo) {
      await deleteStorage(userData.photo);
    }
    if (memberId) {
      await updateData(memberId, fieldsValue);
    }
    handleProfileCard();
  };

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
          <h3>직원 정보</h3>
          <span className="member-desc">{userData?.name} 님의 프로필</span>
        </div>
        <div className="member-btn-area">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              toggleEditMode();
              if (isEditMode) {
                handleUpdate();
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
            file={file}
            setFile={setFile}
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
