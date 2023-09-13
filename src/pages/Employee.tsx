import React from "react";
import styled from "styled-components";

import CardTable from "../components/Employee/CardTable";
import CardHeading from "../components/Employee/CardHeading";

export const Container = styled.div`
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

const CarContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  color: #526484;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 0px 5px 0px;
  word-wrap: break-word;
`;

const Employee = () => {
  return (
    <Container>
      <Header>
        <h2>임직원</h2>
      </Header>
      <CarContainer className="card-container">
        <div className="card-heading">
          <CardHeading />
        </div>
        <div className="card-content">
          <CardTable />
        </div>
        <div className="card-footer"></div>
      </CarContainer>
    </Container>
  );
};

export default Employee;
