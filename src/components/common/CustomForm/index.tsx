import { Form, Input, InputProps, Modal, ModalProps, Select } from "antd";
import { Rule } from "antd/lib/form";
import React, { ReactNode } from "react";

interface FormItemProps {
  label: string;
  name: string;
  disabled?: boolean;
  rules?: Rule[];
  value?: string | string[];
}

function CustomInput({
  label,
  name,
  rules,
  disabled,
  value,
  ...args
}: FormItemProps & InputProps) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input value={value} disabled={disabled} {...args} />
    </Form.Item>
  );
}

function CustomSelect({
  options,
  label,
  name,
  rules,
  disabled,
  defaultValue,
  readOnly,
  value,
  children,
}: FormItemProps & {
  options: Record<string, string>;
  defaultValue?: string;
  readOnly?: boolean;
  mode?: string;
  placeholder?: string;
  onChange?: (selectedUserIds: string[]) => void;
  children?: ReactNode;
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      initialValue={defaultValue}
    >
      <Select
        disabled={disabled}
        className={readOnly ? "readOnly" : undefined}
        value={value}
      >
        {children}
        {Object.entries(options).map(([key, val]) => (
          <Select.Option
            value={Number.isNaN(Number(key)) ? key : Number(key)}
            key={key}
            disabled={key === defaultValue}
          >
            {val}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

interface CustomModalProps {
  children: ReactNode;
}

function CustomModal({
  title,
  width,
  footer,
  children,
  open,
  onCancel,
}: CustomModalProps & ModalProps) {
  return (
    <>
      <Modal
        title={title}
        open={open}
        onCancel={onCancel}
        centered
        width={width}
        footer={footer}
      >
        {children}
      </Modal>
    </>
  );
}

export function useValidate() {
  const required = () => ({ required: true, message: "필수 항목입니다" });

  const max = (maxLength: number) => ({
    max: maxLength,
    message: `최대 ${maxLength}자 이내로 입력해주세요`,
  });

  const min = (minLength: number) => ({
    min: minLength,
    message: `최소 ${minLength}자 이내로 입력해주세요`,
  });

  const pattern = (RegExp: RegExp, message: string) => ({
    pattern: RegExp,
    message,
  });

  return {
    required,
    max,
    min,
    pattern,
  };
}

const CustomForm = {
  Form: Form,
  Input: CustomInput,
  Select: CustomSelect,
  Modal: CustomModal,
  useValidate,
};

export default CustomForm;
