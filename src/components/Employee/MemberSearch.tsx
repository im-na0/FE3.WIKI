import React from "react";
import { Input } from "antd";

interface MemberSearchProps {
  onSearch: (searchText: string) => void; // 검색어 전달 함수 추가
}

export default function MemberSearch({ onSearch }: MemberSearchProps) {
  const handleSearch = (value: string) => {
    onSearch(value); // 검색어를 상위 컴포넌트로 전달
  };

  return (
    <Input
      placeholder="이름 또는 부서 검색"
      allowClear
      size="large"
      style={{ width: 300 }}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
