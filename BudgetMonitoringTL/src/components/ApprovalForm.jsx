import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { numberToWords } from "../js/numberToWords";
import { mockData } from "../mock-data/mockData";
import PrintableCashRequest from "./PrintableCashRequest";

const ApprovalForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  const [amountInWords, setAmountInWords] = useState("");
  const [particulars, setParticulars] = useState([]);

  const infoFields = [
    { label: "Employee", key: "employee" },
    { label: "Position", key: "position" },
    { label: "Department", key: "department" },
    { label: "Paid By", key: "paidBy" },
  ];

  const partnerFields = [
    { label: "Category", key: "category" },
    { label: "Expense Date", key: "expenseDate" },
    { label: "Total", key: "total" },
    { label: "Team Lead", key: "teamLead" },
  ];

  const employeeData = mockData.find((e) => e.employee === data?.employee) || {
    transactions: [],
  };
  const transactions = employeeData.transactions;

  useEffect(() => {
    const items = transactions.map(
      ({ label = "N/A", quantity = 0, price = 0 }) => ({
        label,
        quantity,
        price,
        amount: quantity * price,
      })
    );
    setParticulars(items);
  }, [transactions]);

  const total = transactions.reduce(
    (sum, { quantity = 0, price = 0 }) => sum + quantity * price,
    0
  );

  useEffect(() => {
    if (!isNaN(total)) {
      setAmountInWords(numberToWords(total));
    }
  }, [total]);

  const formatCurrency = (value) =>
    `₱${parseFloat(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;

  return (
    <>
      <Container fluid className="custom-wrapper pb-5">
        {/* Action Buttons */}
        <div className="custom-btn d-flex flex-column flex-md-row gap-1 pt-2 pb-2">
          <Button
            variant="dark"
            onClick={() => navigate(-1)}
            className="btn-responsive"
          >
            ⇦
          </Button>
          <Button variant="success" className="btn-responsive">
            Approve
          </Button>
          <Button variant="danger" className="btn-responsive">
            Refuse
          </Button>
          <Button
            variant="secondary"
            className="btn-responsive"
            onClick={reactToPrintFn}
          >
            Print
          </Button>
        </div>

        {/* Information Fields */}
        <div className="custom-container border border-black p-3 bg-white">
          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Description:</strong>
              <p className="ms-md-2 mb-0 text-start">
                {data?.description || "N/A"}
              </p>
            </Col>
          </Row>

          <Row>
            {partnerFields.map(({ label, key }, idx) => (
              <Col
                key={idx}
                xs={12}
                md={6}
                className="d-flex align-items-center mb-2"
              >
                <strong className="title">{label}:</strong>
                <p className="ms-2 mb-0">
                  {key === "total"
                    ? formatCurrency(data?.[key])
                    : data?.[key] || "N/A"}
                </p>
              </Col>
            ))}
          </Row>

          {infoFields.map(({ label, key }, idx) => (
            <Row key={idx}>
              <Col xs={12} className="d-flex align-items-center mb-2">
                <strong className="title">{label}:</strong>
                <p className="ms-2 mb-0">{data?.[key] || "N/A"}</p>
              </Col>
            </Row>
          ))}

          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Amount in Words:</strong>
              <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
            </Col>
          </Row>
        </div>

        {/* Transactions Table */}
        <Table responsive>
          <thead className="tableHead text-center">
            <tr>
              <th>Label</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody className="tableBody text-center">
            {transactions.map((item, idx) => (
              <tr key={idx}>
                <td>{item.label || "N/A"}</td>
                <td>{item.quantity ?? 0}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>
                  {formatCurrency((item.quantity ?? 0) * (item.price ?? 0))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="custom-col text-end border-end">
                <strong>Total:</strong>
              </td>
              <td className="text-center border-end">
                <strong>{formatCurrency(total)}</strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Container>

      {/* Hidden Printable Component */}
      <div style={{ display: "none" }}>
        <PrintableCashRequest
          data={{ ...data, items: particulars }}
          amountInWords={amountInWords}
          contentRef={contentRef}
        />
      </div>
    </>
  );
};

export default ApprovalForm;
