import React, { useState } from "react";
import { Button } from "antd";
import styled from "styled-components";
import MemberFilter from "./MemberFilter";
import MemberSearch from "./MemberSearch";
import MemberTable from "./MemberTable";
import CustomForm from "../common/CustomForm";
import AddMemberModal from "./AddMemberModal";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteData } from "../../hooks/Employee/useDeleteData";

export default function MemberList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  type selectedRowKeys = {
    id: string;
    teamId?: string;
  };

  const DeleteDataParams = {
    COLLECTION_NAME: "Users",
  };
  const { deleteData } = useDeleteData(DeleteDataParams);
  const [selectedRowKeys, setSelectedRowKeys] = useState<selectedRowKeys[]>([]);
  console.log(selectedRowKeys);
  const handleDelete = async () => {
    try {
      for (const data of selectedRowKeys) {
        await deleteData(data.id, data.teamId);
      }
      setSelectedRowKeys([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2>Employee</h2>
      <List>
        <CardHeader className="card-header">
          <ToggleWrap>
            <MemberFilter
              setFilterValue={setFilterValue}
              setSortValue={setSortValue}
            />
            <MemberSearch onSearch={setSearchText} />
          </ToggleWrap>
          <ToggleWrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openModal}
              size="large"
            >
              Add
            </Button>
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
          <MemberTable
            setSelectedRowKeys={setSelectedRowKeys}
            searchText={searchText}
            filterValue={filterValue}
            sortValue={sortValue}
          />
        </ListTable>
      </List>
    </>
  );
}

const List = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0 0 5px 0;
  word-wrap: break-word;
`;

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
