import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Row, Col, Container } from "react-bootstrap";

import { BudgetAllocationOverview } from "../../../../constants/totalList";
import { allocateHistory } from "../../../../constants/historyColumn";

import BudgetCharts from "../../charts/admin/BudgetCharts";
import AppButton from "../../AppButton";
import TotalCards from "../../../TotalCards";
import ToolBar from "../../../layout/ToolBar";
import DataTable from "../../../layout/DataTable";

const limit = 50;
const offset = 0;

const ViewBudgetAllocation = ({ show, onHide, budgetId, tableData = [] }) => {
  const [filters, setFilters] = useState({ referenceId: "" });
  const [budgetHistory, setBudgetHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  const fetchBudgetHistory = useCallback(async () => {
    if (!budgetId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `/api/cash_disbursement/getcash_disbursement/${budgetId}/${limit}/${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);

      const json = await res.json();
      console.log("🔹 API Raw Response:", json);

      const mappedHistory = (Array.isArray(json.data) ? json.data : []).map(
        (item) => ({
          id: item.id,
          date_issue: item.date_issue,
          received_by: item.received_by,
          amount_issue: item.amount_issue,
          status: item.status,
          date_liquidated: item.date_liquidated,
        })
      );
      console.log("📌 Fetching history for budgetId:", budgetId);
      console.log("🔹 Mapped History:", mappedHistory);
      setBudgetHistory(mappedHistory);
    } catch (err) {
      console.error("❌ Error fetching budget history:", err);
      setBudgetHistory([]);
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  useEffect(() => {
    fetchBudgetHistory();
  }, [fetchBudgetHistory]);

  const budgetItem = useMemo(
    () => tableData.find((item) => item.id === budgetId),
    [budgetId, tableData]
  );

  const noBudget = !budgetId || !budgetItem;

  const {
    department,
    remaining_budget = 0,
    issued_amount = 0,
    transactions = [],
  } = budgetItem || {};

  const totalBudget = Number(remaining_budget) || 0;
  const budgetUsed = Number(issued_amount) || 0;
  const remainingBudget = totalBudget - budgetUsed;

  const totalsData = [{ totalBudget, budgetUsed, remainingBudget }];

  const filteredHistory = useMemo(() => {
    if (!filters.referenceId) return budgetHistory;

    const search = filters.referenceId.toLowerCase();
    return budgetHistory.filter((item) =>
      [item.id, item.received_by, item.status]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search))
    );
  }, [filters.referenceId, budgetHistory]);

  console.log("🔹 Budget History Data:", budgetHistory);
  console.log("🔹 Filtered Data:", filteredHistory);

  if (noBudget) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center p-5">
          No budget data found
        </Modal.Body>
      </Modal>
    );
  }

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
            <BudgetCharts transactions={transactions} />

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
                    data={filteredHistory}
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

      {/* 🔹 Footer */}
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
