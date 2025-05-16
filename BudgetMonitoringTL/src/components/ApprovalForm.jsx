import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { FaStar, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { numberToWords } from "../js/numberToWords";
import { mockData } from "../mock-data/mockData";
import PrintableCashRequest from "./PrintableCashRequest";
import AppButton from "./AppButton";

const ApprovalForm = () => {
  const [amountInWords, setAmountInWords] = useState("");
  const [particulars, setParticulars] = useState([]);
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
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

  // DataTables logic
  const employeeData = mockData.find((e) => e.employee === data?.employee) || {
    transactions: [],
  };
  const transactions = employeeData.transactions;

  useEffect(() => {
    if (transactions.length > 0) {
      const items = transactions.map((item) => ({
        label: item.label ?? "N/A",
        quantity: item.quantity ?? 0,
        price: item.price ?? 0,
        amount: (item.quantity ?? 0) * (item.price ?? 0),
      }));
      setParticulars(items);
    } else {
      setParticulars([]);
    }
  }, [transactions]);

  const total = transactions.reduce(
    (sum, row) => sum + (row.quantity ?? 0) * (row.price ?? 0),
    0
  );

  useEffect(() => {
    if (!isNaN(total)) {
      setAmountInWords(numberToWords(total));
    }
  }, [total]);

  return (
    <>
      <Container fluid>
        <div className="custom-btn d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 pb-3">
          <div className="d-flex gap-1">
            {/* left buttons */}
            <AppButton
              variant="dark"
              size="sm"
              onClick={() => navigate(-1)}
              className="custom-button btn-responsive"
            >
              <FaArrowLeft />
            </AppButton>
            <AppButton
              label="Approve"
              variant="success"
              size="sm"
              className="custom-button btn-responsive"
              onClick={() => {
                // approval logic
              }}
            />
            <AppButton
              label="Reject"
              variant="danger"
              size="sm"
              className="custom-button btn-responsive"
              onClick={() => {
                // refusal logic
              }}
            />
            <AppButton
              label="Print"
              variant="secondary"
              size="sm"
              className="custom-button btn-responsive"
              onClick={reactToPrintFn}
            />
          </div>

          {/* right buttons */}
          <div className="d-flex gap-2 ms-md-auto mt-2 mt-md-0">
            <AppButton
              variant="warning"
              size="sm"
              className="custom-button btn-responsive d-flex align-items-center justify-content-center"
              onClick={() => {
                // mark as important logic
              }}
            >
              <FaStar size={"0.75rem"} />
            </AppButton>
            <AppButton
              variant="dark"
              size="sm"
              className="custom-button btn-responsive d-flex align-items-center justify-content-center"
              onClick={() => {
                // delete logic
              }}
            >
              <FaTrash size={"0.75rem"} />
            </AppButton>
          </div>
        </div>

        {/* Info Fields */}
        <div className="custom-container border p-3 bg-white">
          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Description:</strong>
              <p className="ms-md-2 mb-0 text-start">
                {data?.description || "N/A"}
              </p>
            </Col>
          </Row>

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
                  {field.key === "total"
                    ? `₱${parseFloat(data?.[field.key] || 0).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 }
                      )}`
                    : data?.[field.key] || "N/A"}
                </p>
              </Col>
            ))}
          </Row>

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

        {/* Table (was DataTables) */}
        <Table responsive className="custom-table ">
          <thead className="tableHead text-center">
            <tr>
              <th>Label</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody className="tableBody text-center">
            {transactions.map((row, index) => (
              <tr key={index}>
                <td>{row.label || "N/A"}</td>
                <td>{row.quantity ?? 0}</td>
                <td>
                  {row.price
                    ? `₱${row.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : "₱0.00"}
                </td>
                <td className="">
                  {`₱${((row.quantity ?? 0) * (row.price ?? 0)).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}`}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="custom-col text-end border-end ">
                <strong>Total:</strong>
              </td>
              <td className="text-center border-end ">
                <strong>
                  ₱
                  {total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Container>

      {/* Hidden Printable */}
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
