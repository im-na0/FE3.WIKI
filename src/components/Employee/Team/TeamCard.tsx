import React, { useEffect, useState } from "react";
import {
  Spin,
  Card,
  Avatar,
  Tooltip,
  message,
  Popconfirm,
  Skeleton,
} from "antd";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { FormDataType } from "../../../type/form";
import { useFetchTeamData } from "../../../hooks/Employee/useFetchTeamData";
import { useDeleteData } from "../../../hooks/Employee/useDeleteData";
import { formatDate } from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import styled, { css } from "styled-components";

interface MemberTableProps {
  setSelectedRowKeys: (keys: string[]) => void;
  searchText: string;
  filterValue: string;
  sortValue: string;
}

export default function TeamCard({
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

    setFilteredData(dataWithKeys);
  }, [teamData, filterValue, sortValue, searchText]);

  const handleConfirmDelete = (id: string | undefined) => {
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
              actions={[
                <EyeOutlined
                  key={item.id}
                  onClick={() => navigate(`/employee/team/${item.id}`)}
                />,
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
              <Skeleton loading={loading} avatar active>
                <CardTag
                  department={item.department ? String(item.department) : ""}
                >
                  {item.department}
                </CardTag>
                <CardMeta>
                  <div className="teamName">{item.teamName}</div>
                  <div className="teamDescription">{item.teamDescription}</div>
                </CardMeta>
                <CardContent>
                  <UserList>
                    <Avatar.Group
                      maxCount={3}
                      maxStyle={{
                        backgroundColor: "#fde3cf",
                        color: "#f56a00",
                      }}
                    >
                      {item.teamUsers.map(
                        (user: FormDataType, index: number) => (
                          <span key={`${user.id}-${index}`}>
                            <Tooltip title={user.name} placement="top">
                              <Avatar
                                key={`${user.id}-${index}`}
                                src={user.photo}
                              >
                                {user.name}
                              </Avatar>
                            </Tooltip>
                          </span>
                        ),
                      )}
                    </Avatar.Group>
                  </UserList>
                  <CardDate className="card-date">
                    <CalendarOutlined /> {formatDate(item.createdAt?.toDate())}
                  </CardDate>
                </CardContent>
              </Skeleton>
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
  padding: 1.5rem;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTag = styled.span<{ department: string }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: #df8bf0;
  padding: 3px 13px;
  background: #fbebff;
  border-radius: 1rem;

  ${(props) =>
    props.department === "PM" &&
    css`
      background: #fbebde;
      color: #ef9989;
    `}

  ${(props) =>
    props.department === "BE" &&
    css`
      background: #d8f2f1;
      color: #2ac4db;
    `}

  ${(props) =>
    props.department === "UI/UX" &&
    css`
      background: #e4f8da;
      color: #88c851;
    `}
`;

const CardMeta = styled.div`
  .teamName {
    font-weight: 700;
    font-size: 1.4rem;
    padding: 0.5rem 0;
    margin-bottom: 0.3rem;
  }
  .teamDescription {
    font-size: 0.8rem;
    color: #afafaf;
    padding: 0.3rem 0;
  }
`;

const UserList = styled.ul`
  display: flex;
  padding: 0;
  margin: 0;
`;

const StyledCard = styled(Card)`
  width: 340px;
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

const CardDate = styled.span`
  font-weight: 600;
  color: #444a4d;
`;
