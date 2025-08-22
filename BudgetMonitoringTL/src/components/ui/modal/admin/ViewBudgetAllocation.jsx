import { useState, useEffect } from "react";
import { Modal, Row, Col, Container } from "react-bootstrap";

import { BudgetAllocationOverview } from "../../../../constants/totalList";
import { allocateHistory } from "../../../../constants/historyColumn";

import BudgetCharts from "../../charts/admin/BudgetCharts";
import AppButton from "../../AppButton";
import TotalCards from "../../../TotalCards";
import ToolBar from "../../../layout/ToolBar";
import DataTable from "../../../layout/DataTable";

const ViewBudgetAllocation = ({ show, onHide, budgetId, tableData = [] }) => {
  const [filters, setFilters] = useState({ referenceId: "" });
  const [budgetHistory, setBudgetHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  // ✅ Fetch Budget History
  useEffect(() => {
    if (!budgetId) return;
    const fetchBudgetHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/budget_history/getbudget_history?budget_id=${budgetId}`
        );
        const data = await res.json();
        setBudgetHistory(data || []);
      } catch (err) {
        console.error("Error fetching budget history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgetHistory();
  }, [budgetId]);

  // ✅ Safely compute after hooks
  const budgetItem = tableData.find((item) => item.id === budgetId);
  if (!budgetId || !budgetItem) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center p-5">
          No budget data found
        </Modal.Body>
      </Modal>
    );
  }

  const {
    department,
    remaining_budget = 0,
    issued_amount = 0,
    transactions = [],
  } = budgetItem;

  const amount = Number(remaining_budget) || 0;
  const used = Number(issued_amount) || 0;
  const remaining = amount - used;

  const totalsData = [
    { totalBudget: amount, budgetUsed: used, remainingBudget: remaining },
  ];

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
        <div className="text-white">
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

            {/* ✅ Budget History Table */}
            <Row>
              <Col>
                <div className="custom-container flex-grow-1 p-3 rounded shadow-sm d-flex flex-column mt-3">
                  <ToolBar
                    searchValue={filters.referenceId}
                    onSearchChange={(value) =>
                      setFilters((prev) => ({ ...prev, referenceId: value }))
                    }
                    leftContent={
                      <span
                        className="fw-bold"
                        style={{ fontSize: "0.75rem", color: "black" }}
                      >
                        📑 Budget History
                      </span>
                    }
                    selectedCount={Object.keys(selectedRows).length}
                    showFilter={false}
                  />

                  <DataTable
                    data={budgetHistory}
                    columns={allocateHistory}
                    height="230px"
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                    showActions={false}
                    showCheckbox={false}
                  />
                  {loading && (
                    <div className="text-center mt-2">Loading...</div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
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
