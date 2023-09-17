import React, { useState } from "react";
import { Button } from "antd";
import styled from "styled-components";
import MemberFilter from "./MemberFilter";
import MemberSearch from "./MemberSearch";
import MemberTable from "./MemberTable";
import CustomForm from "../common/CustomForm";
import AddMemberModal from "./AddMemberModal";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteData } from "../../hook/Employee/useDeleteData";

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 1.5rem;
`;

const ToggleWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const ListTable = styled.div`
  width: 100%;
`;

export default function MemberList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { deleteData } = useDeleteData();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleDelete = async () => {
    try {
      for (const id of selectedRowKeys) {
        await deleteData(id);
      }
      setSelectedRowKeys([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <CardHeader className="card-header">
        <ToggleWrap>
          <MemberFilter />
          <MemberSearch />
        </ToggleWrap>
        <ToggleWrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openModal}
            size="large"
          ></Button>
          <CustomForm.Modal
            title="멤버 등록"
            width={700}
            footer={null}
            open={isModalOpen}
            onCancel={closeModal}
          >
            <AddMemberModal onCancel={closeModal} />
          </CustomForm.Modal>
          <Button
            danger={true}
            icon={<DeleteOutlined />}
            size="large"
            onClick={handleDelete}
          ></Button>
        </ToggleWrap>
      </CardHeader>
      <ListTable>
        <MemberTable setSelectedRowKeys={setSelectedRowKeys} />
      </ListTable>
    </>
  );
}
