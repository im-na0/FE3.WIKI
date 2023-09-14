import {
  Form,
  Input,
  InputProps,
  Modal,
  ModalProps,
  Select,
  Button,
} from "antd";
import { Rule } from "antd/lib/form";
import React, { ReactNode } from "react";

interface FormItemProps {
  label: string;
  name: string;
  disabled?: boolean;
  rules?: Rule[];
}

function CustomInput({
  label,
  name,
  rules,
  disabled,
  ...args
}: FormItemProps & InputProps) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input disabled={disabled} {...args} />
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
}: FormItemProps & {
  options: Record<string, string>;
  defaultValue?: string;
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      initialValue={defaultValue}
    >
      <Select disabled={disabled}>
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

function CustomButton({
  children,
  danger,
  icon,
  shape,
  onClick,
  htmlType,
}: CustomButtonProps) {
  return (
    <Form.Item>
      <Button
        htmlType={htmlType}
        type="primary"
        shape={shape}
        danger={danger}
        icon={icon}
        onClick={onClick}
      >
        {children}
      </Button>
    </Form.Item>
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
  Button: CustomButton,
  useValidate,
};

export default CustomForm;
