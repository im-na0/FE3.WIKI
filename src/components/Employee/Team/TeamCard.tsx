import React, { useEffect, useState } from "react";
import { Spin, Card, Avatar, Tooltip, Button, message, Popconfirm } from "antd";
import { FormDataType } from "../../../type/form";
import { useFetchTeamData } from "../../../hooks/Employee/useFetchTeamData";
import { useDeleteData } from "../../../hooks/Employee/useDeleteData";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { styled } from "styled-components";

interface MemberTableProps {
  setSelectedRowKeys: (keys: string[]) => void;
  searchText: string;
  filterValue: string;
  sortValue: string;
}

export default function TeamCard({
  setSelectedRowKeys,
  searchText,
  filterValue,
  sortValue,
}: MemberTableProps) {
  const { loading, teamData } = useFetchTeamData();
  const navigate = useNavigate();
  const { deleteData } = useDeleteData({ COLLECTION_NAME: "Teams" });

  const [filteredData, setFilteredData] = useState<FormDataType[]>(teamData);

  useEffect(() => {
    const searchedData = teamData.filter((item: FormDataType) => {
      if (!searchText) return true;
      const nameIncludes = item.teamName
        ? item.teamName.includes(searchText)
        : false;
      const departmentIncludes = item.department
        ? item.department.includes(searchText)
        : false;
      return nameIncludes || departmentIncludes;
    });

    const sortedDataSource = [...searchedData];
    switch (sortValue) {
      case "sortTeamName":
        sortedDataSource.sort((a, b) =>
          (a.teamName ?? "").localeCompare(b.teamName ?? ""),
        );
        break;
      case "sortDepartment":
        sortedDataSource.sort((a, b) =>
          (a.department ?? "").localeCompare(b.department ?? ""),
        );
        break;
      default:
        break;
    }

    const dataWithKeys = sortedDataSource.map((item) => ({
      ...item,
      key: item.id,
    }));

    console.log(dataWithKeys);

    setFilteredData(dataWithKeys);
  }, [teamData, filterValue, sortValue, searchText]);

  const handleConfirmDelete = (id: string | undefined) => {
    console.log(id);
    if (id != null) {
      deleteData(id);
      message.info("삭제되었습니다");
    }
  };

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : (
        <CardContainer>
          {filteredData.map((item) => (
            <StyledCard
              key={item.id}
              cover={
                // 팀 대표이미지 등록
                item.photo ? <img src={item.photo} alt="Cover Image" /> : null
              }
              title={item.teamName}
              extra={
                <Button onClick={() => navigate(`/employee/team/${item.id}`)}>
                  View
                </Button>
              }
              actions={[
                <Popconfirm
                  key={item.id}
                  title="정말로 삭제하시겠습니까?"
                  onConfirm={() => handleConfirmDelete(item.id)}
                  okText="예"
                  cancelText="아니요"
                >
                  <DeleteOutlined key="delete" />
                </Popconfirm>,
              ]}
            >
              <UserList>
                <Avatar.Group
                  maxCount={3}
                  maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  {item.teamUsers.map((user: FormDataType, index: number) => (
                    <span key={`${user.id}-${index}`}>
                      <Tooltip title={user.name} placement="top">
                        <Avatar key={`${user.id}-${index}`} src={user.photo}>
                          {user.name}
                        </Avatar>
                      </Tooltip>
                    </span>
                  ))}
                </Avatar.Group>
              </UserList>
              <p>Department: {item.department}</p>
              <p>CreatedAt: {item.createdAt?.toDate().toLocaleDateString()}</p>
            </StyledCard>
          ))}
        </CardContainer>
      )}
    </>
  );
}
const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const UserList = styled.ul`
  display: flex;
`;

const StyledCard = styled(Card)`
  width: 300px;
  margin: 16px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);

  .ant-card-cover {
    max-height: 160px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
