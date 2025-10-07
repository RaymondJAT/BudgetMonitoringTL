import { Row, Col, FloatingLabel, Form } from "react-bootstrap";
import CashReqTable from "./CashReqTable";

const EditRequestForm = ({
  formData = {},
  onChange = () => {},
  amountInWords = "",
  amount = 0,
  onAmountChange = () => {},
  onClear = () => {},
}) => {
  return (
    <div className="request-edit-grid">
      <div className="request-container border p-3">
        <Row className="g-2 mb-1">
          {/* PARTICULARS */}
          <Col xs={12} md={8}>
            <FloatingLabel
              controlId="description"
              label="Particulars"
              className="mb-1"
            >
              <Form.Control
                as="textarea"
                rows={1}
                name="description"
                value={formData.description || ""}
                onChange={onChange}
                placeholder="Description"
                className="form-control-sm small-input"
              />
            </FloatingLabel>
          </Col>

          {/* TEAM LEAD */}
          <Col xs={12} md={4}>
            <FloatingLabel
              controlId="team_lead"
              label="Team Lead"
              className="mb-1"
            >
              <Form.Control
                type="text"
                name="team_lead"
                value={formData.team_lead || ""}
                onChange={onChange}
                placeholder="Team Lead"
                className="form-control-sm small-input"
              />
            </FloatingLabel>
          </Col>
        </Row>

        {/* AMOUNT IN WORDS */}
        <Row className="mb-2">
          <Col xs={12}>
            <strong>Amount in Words:</strong>
            <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
          </Col>
        </Row>
      </div>

      <div className="cashreq-table-container mt-3">
        <CashReqTable
          amount={amount}
          onAmountChange={onAmountChange}
          onClear={onClear}
        />
      </div>
    </div>
  );
};

export default EditRequestForm;
