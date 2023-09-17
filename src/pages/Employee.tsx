import React from "react";
import styled from "styled-components";
import MemberList from "../components/Employee/MemberList";

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;

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
  box-shadow: rgba(99, 99, 99, 0.2) 0 0 5px 0;
  word-wrap: break-word;
`;

const Employee = () => {
  return (
    <Container>
      <Header>
        <h4>직원 정보</h4>
      </Header>
      <CardContainer>
        <MemberList />
      </CardContainer>
    </Container>
  );
};

export default Employee;
