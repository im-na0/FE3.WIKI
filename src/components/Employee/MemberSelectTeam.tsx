import React, { useEffect, useState } from "react";
import { Form, FormInstance, Select, Spin } from "antd";
import CustomForm from "../common/CustomForm";
import { userFetchTeamsData } from "../../hooks/Employee/useMemberMutaion";

const { Option } = Select;

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
  const [data, setData] = useState<UserData[]>([]);
  const fetchDataParams = {
    COLLECTION_NAME: "Teams",
  };

  useEffect(() => {
    async function fetchTeams() {
      const teams = await userFetchTeamsData(fetchDataParams);
      setData(teams || []);
      setLoading(false);
    }
    fetchTeams();
  }, []);

  const { required } = CustomForm.useValidate();
  return (
    <Spin spinning={loading}>
      <Form.Item label="팀" name="team" rules={[required()]}>
        <Select
          loading={loading}
          showSearch
          placeholder="Select"
          onChange={(combinedValue) => {
            if (combinedValue) {
              const [title, key] = combinedValue.split("|");
              form.setFieldsValue({ team: combinedValue });
            }
          }}
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            typeof option?.children === "string" &&
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {data?.length > 0 ? (
            data
              .filter((data) => data.key && data.title)
              .map((data) => (
                <Option key={data.key} value={`${data.title}|${data.key}`}>
                  {data.title}
                </Option>
              ))
          ) : (
            <Option value="no-data" disabled>
              데이터 없음
            </Option>
          )}
        </Select>
      </Form.Item>
    </Spin>
  );
}

export default MemberSelectTeam;
