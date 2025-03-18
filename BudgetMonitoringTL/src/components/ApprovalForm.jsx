import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import DataTable from "./DataTable";
import PrintModal from "./PrintModal";
import PrintableCashRequest from "./PrintableCashRequest";

const ApprovalForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();

  const contentRef = useRef(null);
  const reportRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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
        {/* Buttons */}
        <div className="custom-btn d-flex flex-column flex-md-row gap-1 pt-2">
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
            variant="dark"
            onClick={() => setModalShow(true)}
            className="btn-responsive"
          >
            View
          </Button>
          {/* print */}
          <Button
            variant="secondary"
            className="btn-responsive"
            onClick={() => reactToPrintFn()}
          >
            Print
          </Button>
        </div>

        {/* Main container */}
        <div className="custom-container border border-black p-3 bg-white">
          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Description:</strong>
              <p className="ms-md-2 mb-0 text-start">
                {data?.description || "N/A"}
              </p>
            </Col>
          </Row>

          {/* Partner fields */}
          <Row>
            {partnerFields.map((field, index) => (
              <Col
                key={index}
                xs={12}
                md={6}
                className="d-flex align-items-center mb-2"
              >
                <strong className="title">{field.label}:</strong>
                <p className="ms-2 mb-0">{data?.[field.key] || "N/A"}</p>
              </Col>
            ))}
          </Row>

          {/* Fields */}
          {fields.map((field, index) => (
            <Row key={index}>
              <Col xs={12} className="d-flex align-items-center mb-2">
                <strong className="title">{field.label}:</strong>
                <p className="ms-2 mb-0">{data?.[field.key] || "N/A"}</p>
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

        <DataTable
          employeeName={data?.employee || ""}
          setAmountInWords={setAmountInWords}
          setParticulars={setParticulars}
        />
      </Container>

      <PrintModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={{ ...data, items: particulars }}
        amountInWords={amountInWords}
      />

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
