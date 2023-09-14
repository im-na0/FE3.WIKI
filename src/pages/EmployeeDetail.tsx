import { useParams } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import "../styles/Employee.css";
import MemberDetailInfo from "../components/Employee/MemberDetailInfo";

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  color: #191d25;

  @media (min-width: 576px) {
    max-width: 576px;
  }

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 992px) {
    max-width: 992px;
  }

  @media (min-width: 1200px) {
    max-width: 1200px;
  }
`;
const Header = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  color: #526484;
  word-wrap: break-word;
`;
function EmployeeDetail() {
  const { memberId } = useParams();
  return (
    <Container>
      <CardContainer className="card-container">
        <MemberDetailInfo />
      </CardContainer>
    </Container>
  );
}

export default EmployeeDetail;
