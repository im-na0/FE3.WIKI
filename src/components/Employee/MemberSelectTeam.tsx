import React, { useEffect, useState } from "react";
import { FormInstance, Spin } from "antd";
import CustomForm from "../common/CustomForm";
import { userFetchTeamsData } from "../../hooks/Employee/useMemberMutaion";

interface UserData {
  key: string;
  title: string;
}

interface MemberSelectTeamProps {
  readOnly: boolean;
  form: FormInstance;
}

function MemberSelectTeam({ readOnly, form }: MemberSelectTeamProps) {
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
        onChange={(combinedValue) => {
          if (combinedValue) {
            const [title, key] = combinedValue.split("|");
            form.setFieldsValue({ team: combinedValue });
          }
        }}
      />
    </Spin>
  );
}

export default MemberSelectTeam;
