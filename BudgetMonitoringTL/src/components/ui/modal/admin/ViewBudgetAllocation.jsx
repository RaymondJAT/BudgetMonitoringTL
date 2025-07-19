import { useState } from "react";

import { Modal, Form, Row, Col, Container } from "react-bootstrap";

import { BudgetAllocationOverview } from "../../../../constants/totalList";
import BudgetCharts from "../../charts/admin/BudgetCharts";

import AppButton from "../../AppButton";
import TotalCards from "../../../TotalCards";
import ToolBar from "../../../layout/ToolBar";
import AllocationTable from "../../../layout/AllocationTable";

const ViewBudgetAllocation = ({ show, onHide, budgetId, tableData = [] }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [filters, setFilters] = useState({
    referenceId: "",
    amount: "",
    date: "",
  });

  const budgetItem = tableData.find((item) => item.id === budgetId);
  const {
    department,
    allocated = 0,
    used = 0,
    transactions = [],
  } = budgetItem || {};

  if (!budgetId || !budgetItem) return null;

  const remaining = allocated - used;

  const totalsData = [
    {
      totalBudget: allocated,
      budgetUsed: used,
      remainingBudget: remaining,
    },
  ];

  // Monthly Spending Trend
  const monthlyTrendMap = {};
  transactions.forEach(({ amount, month }) => {
    monthlyTrendMap[month] = (monthlyTrendMap[month] || 0) + amount;
  });

  // Spending by Type
  const typeMap = {
    "Cash Request": 0,
    Liquidation: 0,
    Reimbursement: 0,
  };
  transactions.forEach(({ type, amount }) => {
    typeMap[type] = (typeMap[type] || 0) + amount;
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-xl"
      centered
      scrollable
    >
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          {department}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        <Form className="text-white">
          {/* Total Cards */}
          <Row>
            <Col>
              <TotalCards
                data={totalsData}
                list={BudgetAllocationOverview}
                type="view"
                size="sm"
              />
            </Col>
          </Row>

          <Container fluid>
            {/* Charts */}
            <BudgetCharts transactions={transactions} />
            {/* Transactions List */}
            <Row>
              <Col>
                <div className="custom-container flex-grow-1 p-3 rounded shadow-sm d-flex flex-column mt-2">
                  <ToolBar
                    searchValue={filters.referenceId}
                    onSearchChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        referenceId: value,
                      }))
                    }
                    leftContent={
                      <span
                        className="fw-bold"
                        style={{ fontSize: "0.75rem", color: "black" }}
                      >
                        💸 Transactions
                      </span>
                    }
                    selectedCount={0}
                    showFilter={false}
                  />

                  <AllocationTable
                    budgetId={budgetId}
                    tableData={tableData}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    filters={filters}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Download PDF"
          variant="outline-secondary"
          onClick={() => console.log("Download PDF")}
          className="custom-app-button me-2"
        />

        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={onHide}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ViewBudgetAllocation;
