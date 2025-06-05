import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { FaStar, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { numberToWords } from "../../utils/numberToWords";
import { mockData } from "../../handlers/mockData";
import { toast } from "react-toastify";
import PrintableCashRequest from "../print/PrintableCashRequest";
import AppButton from "../ui/AppButton";

const ApprovalForm = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const [particulars, setParticulars] = useState([]);
  const [amountInWords, setAmountInWords] = useState("");

  const reactToPrintFn = useReactToPrint({ contentRef });

  const employeeData = mockData.find((e) => e.employee === data?.employee) || {
    transactions: [],
  };
  const transactions = employeeData.transactions;

  const total = transactions.reduce(
    (sum, row) => sum + (row.quantity ?? 0) * (row.price ?? 0),
    0
  );

  useEffect(() => {
    const items = transactions.map((item) => ({
      label: item.label ?? "N/A",
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
      amount: (item.quantity ?? 0) * (item.price ?? 0),
    }));
    setParticulars(items);
  }, [transactions]);

  useEffect(() => {
    if (!isNaN(total)) {
      setAmountInWords(numberToWords(total));
    }
  }, [total]);

  const moveToTrash = (entry) => {
    const trashData = JSON.parse(localStorage.getItem("trashData") || "[]");
    localStorage.setItem("trashData", JSON.stringify([...trashData, entry]));
  };

  const markAsImportant = (entry) => {
    const importantData = JSON.parse(
      localStorage.getItem("importantData") || "[]"
    );
    localStorage.setItem(
      "importantData",
      JSON.stringify([...importantData, entry])
    );
  };

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

  const renderPartnerFields = () => (
    <Row>
      {partnerFields.map(({ label, key }, index) => (
        <Col
          key={index}
          xs={12}
          md={6}
          className="d-flex align-items-center mb-2"
        >
          <strong className="title">{label}:</strong>
          <p className="ms-2 mb-0">
            {key === "total"
              ? `₱${parseFloat(data?.[key] || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}`
              : data?.[key] || "N/A"}
          </p>
        </Col>
      ))}
    </Row>
  );

  const renderEmployeeFields = () =>
    fields.map(({ label, key }, index) => (
      <Row key={index}>
        <Col xs={12} className="d-flex align-items-center mb-2">
          <strong className="title">{label}:</strong>
          <p className="ms-2 mb-0">{data?.[key] || "N/A"}</p>
        </Col>
      </Row>
    ));

  return (
    <>
      <Container fluid>
        {/* Action Buttons */}
        <div className="custom-btn d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 pb-3">
          <div className="d-flex gap-1">
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

          <div className="d-flex gap-2 ms-md-auto mt-2 mt-md-0">
            {/* mark as important */}
            <AppButton
              variant="warning"
              size="sm"
              className="custom-button btn-responsive d-flex align-items-center justify-content-center"
              onClick={() => {
                markAsImportant(data);
                toast.success("Entry marked as important.");
              }}
            >
              <FaStar size="0.75rem" />
            </AppButton>

            {/* delete button */}
            <AppButton
              variant="dark"
              size="sm"
              className="custom-button btn-responsive d-flex align-items-center justify-content-center"
              onClick={() => {
                moveToTrash(data);
                navigate(-1);
                toast.success("Entry moved to trash.");
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

          {renderPartnerFields()}
          {renderEmployeeFields()}

          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Amount in Words:</strong>
              <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Table responsive className="custom-table">
          <thead className="tableHead text-center">
            <tr>
              <th>Label</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody className="tableBody text-center">
            {transactions.map((row, index) => (
              <tr key={index}>
                <td>{row.label || "N/A"}</td>

                <td>
                  ₱
                  {(row.price ?? 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>{row.quantity ?? 0}</td>
                <td>
                  ₱
                  {((row.quantity ?? 0) * (row.price ?? 0)).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end border-end">
                <strong>Total:</strong>
              </td>
              <td className="text-center border-end">
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

        {/* Image Container */}
        <div className="custom-container border p-3 bg-white">
          <h6 className="mb-3">Attached Images</h6>
          <div className="d-flex flex-wrap gap-3">
            {(data?.images?.length > 0 ? data.images : []).map(
              (imgSrc, index) => (
                <div
                  key={index}
                  className="image-box border rounded p-1"
                  style={{
                    width: "150px",
                    height: "150px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`attachment-${index}`}
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )
            )}
            {(!data?.images || data.images.length === 0) && (
              <p className="text-muted">No images attached.</p>
            )}
          </div>
        </div>
      </Container>

      {/* Hidden Printable */}
      <div className="d-none">
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
