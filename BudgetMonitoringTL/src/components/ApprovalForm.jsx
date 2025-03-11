import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import DataTable from "./DataTable";
import PrintModal from "./PrintModal";

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

  const [modalShow, setModalShow] = useState(false);
  const [amountInWords, setAmountInWords] = useState("");
  const [particulars, setParticulars] = useState([]);

  return (
    <>
      <Container className="custom-wrapper pb-5">
        {/* buttons */}
        <div className="custom-btn d-flex flex-column flex-md-row gap-1 pt-2">
          <Button variant="success" className="btn-responsive">
            Approve
          </Button>
          <Button variant="danger" className="btn-responsive">
            Refuse
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModalShow(true)}
            className="btn-responsive"
          >
            View
          </Button>
        </div>

        {/* main container */}
        <div className="custom-container border border-black p-3 bg-white">
          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Description:</strong>
              <p className="ms-md-2 mb-0 text-start">
                {data?.description || " "}
              </p>
            </Col>
          </Row>

          {/* partner fields */}
          <Row>
            {partnerFields.map((field, index) => (
              <Col
                key={index}
                xs={12}
                md={6}
                className="d-flex align-items-center mb-2"
              >
                <strong className="title">{field.label}:</strong>
                <p className="ms-2 mb-0">{data?.[field.key] || " "}</p>
              </Col>
            ))}
          </Row>

          {/* fields */}
          {fields.map((field, index) => (
            <Row key={index}>
              <Col xs={12} className="d-flex align-items-center mb-2">
                <strong className="title">{field.label}:</strong>
                <p className="ms-2 mb-0">{data?.[field.key] || " "}</p>
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

        {/* Table Section */}
        <DataTable
          setAmountInWords={setAmountInWords}
          setParticulars={setParticulars}
        />
      </Container>

      <PrintModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={{ ...data, items: particulars }} // Ensure items are passed
        amountInWords={amountInWords}
      />
    </>
  );
};

export default ApprovalForm;
