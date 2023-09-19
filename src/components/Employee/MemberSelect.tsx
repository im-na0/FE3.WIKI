import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../libs/firebase";

const { Option } = Select;

interface MemberSelectProps {
  onChange: (selectedUserIds: string[]) => void;
}

interface UserData {
  id?: string;
  name?: string;
}

function MemberSelect({ onChange }: MemberSelectProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollectionRef = collection(db, "Users");
      const userSnapshot = await getDocs(userCollectionRef);
      const userArray: UserData[] = [];

      userSnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        userArray.push(userData);
      });

      setUsers(userArray);
    };

    fetchUsers();
  }, []);

  const handleUserChange = (selectedUserIds: string[]) => {
    setSelectedUsers(selectedUserIds);
    onChange(selectedUserIds);
  };

  return (
    <Select
      mode="multiple"
      placeholder="Select users"
      onChange={handleUserChange}
      value={selectedUsers}
      style={{ width: "100%" }}
    >
      {users.map((user) => (
        <Option key={user.id} value={user.id}>
          {user.name}
        </Option>
      ))}
    </Select>
  );
}

export default MemberSelect;
