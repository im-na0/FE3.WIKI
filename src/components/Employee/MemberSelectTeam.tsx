import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import CustomForm from "../common/CustomForm";
import { userFetchTeamsData } from "../../hooks/Employee/useMemberMutaion";
import { FormDataType } from "../../type/form";

interface UserData {
  key: string;
  title: string;
}

interface MemberSelectTeamProps {
  readOnly: boolean;
}

function MemberSelectTeam({ readOnly }: MemberSelectTeamProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserData[] | undefined>(undefined);
  const fetchDataParams = {
    COLLECTION_NAME: "Teams",
  };

  useEffect(() => {
    async function fetchTeams() {
      const teams = await userFetchTeamsData(fetchDataParams);
      setData(teams);
      setLoading(false);
    }
    fetchTeams();
  }, []);

  console.log(data);

  const { required } = CustomForm.useValidate();
  return (
    <Spin spinning={loading}>
      <CustomForm.SearchSelect
        loading={loading}
        rules={[required()]}
        label="팀"
        item={data}
        name="team"
        readOnly={readOnly}
      />
    </Spin>
  );
}

export default MemberSelectTeam;
