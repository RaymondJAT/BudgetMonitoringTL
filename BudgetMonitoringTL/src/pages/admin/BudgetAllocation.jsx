import { Container } from "react-bootstrap";

import { mockBudgets } from "../../constants/mockBudgets";

import ToolBar from "../../components/layout/ToolBar";
import BudgetTable from "../../components/layout/BudgetTable";
import { useState } from "react";

const BudgetAllocation = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <Container fluid className="py-3">
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
          <BudgetTable data={mockBudgets} height="250px" />
        </div>
      </Container>
    </>
  );
};

export default BudgetAllocation;
