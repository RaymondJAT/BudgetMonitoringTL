import { Row, Col, FloatingLabel, Form } from "react-bootstrap";

const RequestForm = ({
  fields = [],
  formData = {},
  onChange = () => {},
  amountInWords = "",
}) => {
  const getField = (key) => fields.find((f) => f.key === key) || {};

  return (
    <>
      <div className="request-container border p-3">
        <Row className="mb-2">
          <Col xs={12}>
            <FloatingLabel
              controlId="description"
              label="Description"
              className="mb-2"
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
        </Row>

        <Row className="mb-2">
          {["employee", "department", "position"].map((key) => {
            const { label = "", type = "text" } = getField(key);
            return (
              <Col xs={12} md={4} key={key}>
                <FloatingLabel controlId={key} label={label} className="mb-2">
                  <Form.Control
                    type={type}
                    name={key}
                    value={formData[key] || ""}
                    onChange={onChange}
                    placeholder={label}
                    readOnly
                    className="form-control-sm small-input"
                  />
                </FloatingLabel>
              </Col>
            );
          })}
        </Row>

        <Row>
          {["expenseDate", "teamLead"].map((key) => {
            const { label = "", type = "text" } = getField(key);
            return (
              <Col xs={12} md={6} className="mb-2" key={key}>
                <FloatingLabel controlId={key} label={label} className="mb-2">
                  <Form.Control
                    type={type}
                    name={key}
                    value={
                      key === "expenseDate"
                        ? formData[key] ||
                          new Date().toISOString().split("T")[0]
                        : formData[key] || ""
                    }
                    onChange={onChange}
                    placeholder={label}
                    className="form-control-sm small-input"
                  />
                </FloatingLabel>
              </Col>
            );
          })}
        </Row>

        {/* Amount in Words */}
        <Row className="mb-2">
          <Col xs={12}>
            <strong>Amount in Words:</strong>
            <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RequestForm;
