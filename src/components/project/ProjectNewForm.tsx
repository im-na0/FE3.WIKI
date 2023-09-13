import React from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { SaveFilled } from "@ant-design/icons";
import ProjectMdEditor from "./ProjectMdEditor";

const { RangePicker } = DatePicker;

const ProjectNewForm = ({ isEdit }: { isEdit: boolean }) => {
  // const onFormLayoutChange = () => {};

  return (
    <div className="project-container">
      <div className="project__top-title">
        <h3>프로젝트 {isEdit ? "수정" : "추가"}</h3>
        <Button type="primary" icon={<SaveFilled />} size="large">
          저장
        </Button>
      </div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        // onValuesChange={onFormLayoutChange}
        style={{ maxWidth: 768 }}
      >
        <Form.Item label="프로젝트 명:">
          <Input placeholder="프로젝트명을 입력 해주세요." />
        </Form.Item>
        <Form.Item label="담당자:">
          <Select placeholder="담당자를 선택 해주세요.">
            <Select.Option value="김미정">김미정</Select.Option>
            <Select.Option value="김성겸">김성겸</Select.Option>
            <Select.Option value="노욱진">노욱진</Select.Option>
            <Select.Option value="박나영">박나영</Select.Option>
            <Select.Option value="진종수">진종수</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="프로젝트 담당:">
          <Select placeholder="프로젝트를 담당할 팀을 선택 해주세요.">
            <Select.Option value="FE1팀">FE1팀</Select.Option>
            <Select.Option value="FE2팀">FE2팀</Select.Option>
            <Select.Option value="BE1팀">BE1팀</Select.Option>
            <Select.Option value="BE2팀">BE2팀</Select.Option>
            <Select.Option value="QA팀">QA팀</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="프로젝트 기간:">
          <RangePicker />
        </Form.Item>
      </Form>
      <ProjectMdEditor />
    </div>
  );
};

export default ProjectNewForm;
