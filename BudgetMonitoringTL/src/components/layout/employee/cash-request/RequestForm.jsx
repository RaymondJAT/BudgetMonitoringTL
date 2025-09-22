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
        {/* PARTICULARS */}
        <Row className="mb-1">
          <Col xs={12}>
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
        </Row>

        {/* EMPLOYEE DETAILS */}
        <Row className="mb-1">
          {["employee", "department", "position"].map((key) => {
            const { label = "", type = "text" } = getField(key);
            return (
              <Col xs={12} md={4} key={key}>
                <FloatingLabel controlId={key} label={label} className="mb-1">
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

        {/* DATE + TEAM LEAD */}
        <Row>
          {["request_date", "team_lead"].map((key) => {
            const { label = "", type = "text" } = getField(key);
            return (
              <Col xs={12} md={6} className="mb-1" key={key}>
                <FloatingLabel controlId={key} label={label} className="mb-1">
                  <Form.Control
                    type={type}
                    name={key}
                    value={
                      key === "request_date"
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

        {/* AMOUNT IN WORDS */}
        <Row className="mb-1">
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
