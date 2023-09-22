import React, { useState, useEffect } from "react";
import { Button } from "antd";
import styled from "styled-components";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import {
  userState,
  userAccessState,
  fetchUserAccess,
} from "../../store/member";
import MemberFilter from "./MemberFilter";
import MemberSearch from "./MemberSearch";
import MemberTable from "./MemberTable";
import CustomForm from "../common/CustomForm";
import AddMemberModal from "./AddMemberModal";
import { useDeleteData } from "../../hooks/Employee/useDeleteData";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function MemberList() {
  const [user, setUser] = useRecoilState(userState);
  const [userAccess, setUserAccess] = useRecoilState(userAccessState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<selectedRowKeys[]>([]);
  const userAccessLoadable = useRecoilValueLoadable(fetchUserAccess);

  useEffect(() => {
    if (userAccessLoadable.state === "hasValue") {
      console.log(userAccessLoadable.contents);
      setUserAccess(userAccessLoadable.contents as string | null);
    }
  }, [userAccessLoadable.state, setUserAccess, userAccessLoadable.contents]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        const db = getFirestore();
        const userRef = doc(db, "Users", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  type selectedRowKeys = {
    id: string;
    teamId?: string;
  };

  const DeleteDataParams = {
    COLLECTION_NAME: "Users",
  };
  const { deleteData } = useDeleteData(DeleteDataParams);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            {userAccess === "admin" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openModal}
                size="large"
              >
                Add
              </Button>
            )}
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
