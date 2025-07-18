import { useState, useMemo } from "react";

import {
  Modal,
  Form,
  Row,
  Col,
  Container,
  Table,
  FloatingLabel,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { BudgetAllocationOverview } from "../../../../constants/totalList";
import ChartCard from "../../../ChartCard";
import AppButton from "../../AppButton";
import TotalCards from "../../../TotalCards";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

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

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((tx) => {
      const matchesReference =
        tx.referenceId
          ?.toLowerCase()
          .includes(filters.referenceId.toLowerCase()) ?? true;

      const matchesAmount = filters.amount
        ? parseFloat(tx.amount || 0) >= parseFloat(filters.amount)
        : true;

      const matchesDate = filters.date ? tx.date === filters.date : true;

      return matchesReference && matchesAmount && matchesDate;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return filtered;
  }, [filters, sortConfig, transactions]);

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
  const monthlyTrendData = Object.entries(monthlyTrendMap).map(
    ([month, amount]) => ({
      month,
      amount,
    })
  );

  // Spending by Type
  const typeMap = {
    "Cash Request": 0,
    Liquidation: 0,
    Reimbursement: 0,
  };
  transactions.forEach(({ type, amount }) => {
    typeMap[type] = (typeMap[type] || 0) + amount;
  });
  const spendingByTypeData = Object.entries(typeMap).map(([name, value]) => ({
    name,
    value,
  }));

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={10}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

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
          {/* Department Info */}
          <Container fluid>
            <Row>
              <Col md={12}>
                <FloatingLabel
                  controlId="viewBudget"
                  label="Department"
                  className="text-dark small"
                >
                  <Form.Control
                    type="text"
                    value={department}
                    disabled
                    className="form-control-sm small-input fw-bold"
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Container>

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

          {/* Charts */}
          <Container fluid>
            <Row className="g-3">
              {/* Wider Line Chart */}
              <Col md={7} className="mb-2">
                <ChartCard
                  title="📈 Monthly Spending Trend"
                  style={{ fontSize: "0.75rem" }}
                >
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#800000"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Col>

              {/* Square Pie Chart */}
              <Col md={5} className="mb-2">
                <ChartCard
                  title="🥧 Spending by Type"
                  style={{ fontSize: "0.75rem" }}
                >
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={spendingByTypeData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius="90%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {spendingByTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
                      <Legend
                        wrapperStyle={{ fontSize: "0.75rem" }}
                        formatter={(value, entry, index) => (
                          <span style={{ marginLeft: "6px" }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Col>
            </Row>

            {/* Transactions List */}
            <Row>
              <Col>
                <div className="custom-container flex-grow-1 p-3 rounded shadow-sm d-flex flex-column mt-2">
                  <Form.Label
                    style={{ fontSize: "0.75rem", color: "black" }}
                    className="fw-bold"
                  >
                    💸 Transactions
                  </Form.Label>
                  <div
                    className="table-wrapper flex-grow-1 overflow-auto"
                    style={{ maxHeight: "180px" }}
                  >
                    <Table hover className="expense-table mb-0">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th
                            onClick={() => handleSort("referenceId")}
                            style={{ cursor: "pointer" }}
                          >
                            Reference ID {renderSortIcon("referenceId")}
                          </th>
                          <th>Description</th>
                          <th
                            onClick={() => handleSort("amount")}
                            style={{ cursor: "pointer" }}
                          >
                            Amount {renderSortIcon("amount")}
                          </th>
                          <th>Status</th>
                          <th
                            onClick={() => handleSort("date")}
                            style={{ cursor: "pointer" }}
                          >
                            Date {renderSortIcon("date")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((tx, idx) => (
                            <tr key={idx}>
                              <td>{tx.type}</td>
                              <td>{tx.referenceId || "—"}</td>
                              <td
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {tx.description || "—"}
                              </td>
                              <td>
                                ₱{" "}
                                {parseFloat(tx.amount || 0).toLocaleString(
                                  "en-PH",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${String(
                                    tx.status
                                  ).toLowerCase()}`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                              <td>{tx.date || "—"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-muted">
                              No transactions found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
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
