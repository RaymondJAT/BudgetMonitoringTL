import { Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { formFields } from "../../../../handlers/columnHeaders";

const pesoFields = ["amount_obtained", "amount_expended", "reimburse_return"];

const LiquidForm = ({ formData = {} }) => {
  const formatPeso = (value) => {
    if (value === "" || value == null || isNaN(value)) return "₱0.00";
    return (
      "₱" +
      Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const enhancedFields = formFields.map((column) =>
    column.map((field) => {
      if (pesoFields.includes(field.name)) {
        return {
          ...field,
          type: "text", // render ₱ with formatting
        };
      }
      return field;
    })
  );

  return (
    <div className="request-container border p-3 mb-2">
      {/* DESCRIPTION FIELD (now read-only too) */}
      <Row className="mb-3">
        <Col md={12}>
          <FloatingLabel controlId="description" label="Description">
            <Form.Control
              type="text"
              name="description"
              value={formData.description || ""}
              placeholder="Enter description"
              className="form-control-sm small-input"
              readOnly // 🔹 Now also readonly
            />
          </FloatingLabel>
        </Col>
      </Row>

      {/* DYNAMIC FIELDS (all read-only) */}
      <Row>
        {enhancedFields.map((column, colIndex) => (
          <Col md={6} key={`col-${colIndex}`}>
            {column.map((field) => (
              <FloatingLabel
                key={field.controlId}
                controlId={field.controlId}
                label={field.label}
                className="mb-2"
              >
                <Form.Control
                  type={field.type || "text"}
                  name={field.name}
                  value={
                    pesoFields.includes(field.name)
                      ? formatPeso(formData[field.name])
                      : formData[field.name] || ""
                  }
                  placeholder={field.label}
                  className="form-control-sm small-input"
                  readOnly // 🔹 All fields readonly
                />
              </FloatingLabel>
            ))}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LiquidForm;
