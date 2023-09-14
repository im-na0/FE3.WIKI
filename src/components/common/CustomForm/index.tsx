import { Form, Input, InputProps, Modal, ModalProps, Select } from "antd";
import { Rule } from "antd/lib/form";
import React, { ReactNode } from "react";

interface FormItemProps {
  label: string;
  name: string;
  disabled?: boolean;
  rules?: Rule[];
  value?: string;
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
}: FormItemProps & {
  options: Record<string, string>;
  defaultValue?: string;
  readOnly?: boolean;
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      initialValue={defaultValue}
    >
      <Select disabled={disabled} className={readOnly ? "readOnly" : undefined}>
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
  style,
  footer,
  children,
  open,
  onCancel,
}: CustomModalProps & ModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      centered
      width={width}
      style={style}
      footer={footer}
      transitionName="none"
      maskTransitionName="none"
    >
      {children}
    </Modal>
  );
}

interface CustomButtonProps {
  children?: string;
  danger?: boolean;
  icon?: ReactNode;
  shape?: "circle" | "default" | "round" | undefined;
  onClick?: () => void;
  htmlType?: "button" | "submit" | "reset";
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
