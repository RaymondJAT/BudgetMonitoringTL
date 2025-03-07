import React, { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";

const ApprovalForm = ({ data }) => {
  const fields = [
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

  const [tableData, setTableData] = useState([
    { label: "Ticket", quantity: 1, price: 250, amount: 250 },
    { label: "Food", quantity: 2, price: 100, amount: 200 },
    { label: "Others", quantity: 1, price: 50, amount: 50 },
  ]);

  // calculate total amount
  const calculateTotal = () => {
    return tableData.reduce((sum, row) => sum + row.amount, 0);
  };

  // add new row
  //   const addRow = () => {
  //     setTableData([
  //       ...tableData,
  //       { label: "New Item", quantity: 1, price: 0.0, amount: 0.0 },
  //     ]);
  //   };

  return (
    <>
      <div className="custom-wrapper">
        {/* Buttons */}
        <div className="custom-btn d-flex flex-column flex-md-row gap-1 pt-4">
          <Button variant="success" className="btn-responsive">
            Approve
          </Button>
          <Button variant="danger" className="btn-responsive">
            Refuse
          </Button>
          <Button variant="secondary" className="btn-responsive">
            Print
          </Button>
        </div>

        {/* Main container */}
        <Container className="custom-container border border-black p-3 bg-white">
          <Row>
            <Col xs={12} className="d-flex align-items-center mb-2">
              <strong className="title">Description:</strong>
              <p className="ms-2 mb-0">
                {data?.description || "________________________"}
              </p>
            </Col>
          </Row>

          {/* Partner Fields */}
          <Row>
            {partnerFields.map((field, index) => (
              <Col
                key={index}
                xs={12}
                md={6}
                className="d-flex align-items-center mb-2"
              >
                <strong className="title">{field.label}:</strong>
                <p className="ms-2 mb-0">
                  {data?.[field.key] || "________________"}
                </p>
              </Col>
            ))}
          </Row>

          {/* Fields */}
          {fields.map((field, index) => (
            <Row key={index}>
              <Col xs={12} className="d-flex align-items-center mb-2">
                <strong className="title">{field.label}:</strong>
                <p className="ms-2 mb-0">
                  {data?.[field.key] || "________________"}
                </p>
              </Col>
            </Row>
          ))}

          <Row>
            <Col xs={12} className="d-flex align-items-center mb-2">
              <strong className="title">Amount in Words:</strong>
              <p className="ms-2 mb-0">
                {data?.amountInWords || "________________________"}
              </p>
            </Col>
          </Row>
        </Container>

        {/* Table Section */}
        <div className="table-wrapper border border-black p-3">
          <Table responsive>
            <thead className="tableHead">
              <tr>
                <th>Label</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.label}</td>
                  <td>{row.quantity}</td>
                  <td>{row.price.toFixed(2)}</td>
                  <td>{row.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            {/* Total and Amount Due */}
            <tfoot>
              <tr>
                <td colSpan="3" className="custom-col text-end">
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>{calculateTotal().toFixed(2)}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="custom-col text-end">
                  <strong>Amount Due:</strong>
                </td>
                <td>
                  <strong>{calculateTotal().toFixed(2)}</strong>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>

        {/* Add Button */}
        {/* <div className="d-flex justify-content-end mt-2">
          <Button variant="primary" onClick={addRow}>
            Add Row
          </Button>
        </div> */}
      </div>
    </>
  );
};

export default ApprovalForm;
