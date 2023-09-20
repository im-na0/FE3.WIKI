import { useState } from "react";
import { useNavigate } from "react-router-dom";
const useModal = () => {
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const navigate = useNavigate();
  const showModal = () => {
    setEmailModalOpen(true);
  };

  const handleCancel = () => {
    setEmailModalOpen(false);
  };

  const handleOk = () => {
    setEmailModalOpen(false);
    navigate("/start-register");
  };

  return { isEmailModalOpen, showModal, handleCancel, handleOk };
};

export default useModal;
