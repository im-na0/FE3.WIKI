import React, { useState, useEffect } from "react";
import { Transfer, Form } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../libs/firebase";
import { Rule } from "antd/lib/form";
import CustomForm from "../common/CustomForm";

interface MemberSelectProps {
  onChange: (selectedUserIds: string[]) => void;
  rules?: Rule[];
}

interface UserData {
  key: string;
  title: string;
}

function TeamMemberSelect({ onChange }: MemberSelectProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUserKeys, setSelectedUserKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollectionRef = collection(db, "Users");
      const userSnapshot = await getDocs(userCollectionRef);
      const userArray: UserData[] = [];

      userSnapshot.forEach((doc) => {
        const userData = { key: doc.id, title: doc.data().name || "" };
        userArray.push(userData);
      });
      setUsers(userArray);
    };

    fetchUsers();
  }, []);

  const handleUserChange = (nextSelectedKeys: string[]) => {
    setSelectedUserKeys(nextSelectedKeys);
    onChange(nextSelectedKeys);
  };

  const { required } = CustomForm.useValidate();

  return (
    <>
      <Form.Item label="팀원" name="userId" rules={[required()]}>
        <Transfer
          dataSource={users}
          targetKeys={selectedUserKeys}
          onChange={handleUserChange}
          render={(item) => item.title}
          showSearch
          listStyle={{ width: "100%" }}
        />
      </Form.Item>
    </>
  );
}

export default TeamMemberSelect;
