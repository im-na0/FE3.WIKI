import {
  ExclamationCircleFilled,
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import React, { ReactNode, useState } from "react";
import { Button, Dropdown, Modal } from "antd";
import styled from "styled-components";
import CustomForm from "../common/CustomForm";
import AddMemberModal from "./AddMemberModal";

const AddMemberSpan = styled.div`
  width: 100%;
`;

const { confirm } = Modal;

const showConfirm = () => {
  confirm({
    title: "선택한 멤버를 삭제하시겠습니까?",
    icon: <ExclamationCircleFilled />,
    content: "삭제하신 항목은 복구 할 수 없습니다. 😨",
    centered: true,
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export default function MemberControlMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [modalContent, setModalContent] = useState(null); // 모달 컨텐츠 상태 추가

  const showModal = (content: any) => {
    setIsModalOpen(true);
    setModalContent(content);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const items = [
    {
      label: (
        <AddMemberSpan
          onClick={() =>
            showModal(<AddMemberModal onCancel={handleModalCancel} />)
          }
        >
          <UserAddOutlined /> Add Member
        </AddMemberSpan>
      ),
      key: "addMember",
    },
    {
      label: (
        <AddMemberSpan onClick={showConfirm}>
          <UserDeleteOutlined /> Delete Member
        </AddMemberSpan>
      ),
      key: "addTeam",
      danger: true,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items }}
        autoAdjustOverflow={true}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Button type="primary" icon={<PlusOutlined />} size="large" />
      </Dropdown>

      {modalContent && (
        <CustomForm.Modal
          title="멤버 등록"
          width={700}
          footer={null}
          open={isModalOpen}
          onCancel={handleModalCancel}
        >
          {modalContent}
        </CustomForm.Modal>
      )}
    </>
  );
}
