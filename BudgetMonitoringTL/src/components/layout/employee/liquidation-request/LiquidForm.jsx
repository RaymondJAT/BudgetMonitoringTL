import { Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { formFields } from "../../../../handlers/columnHeaders";

const LiquidForm = ({ formData = {}, onChange = () => {} }) => {
  const preventInvalidKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v")) {
      e.preventDefault();
    }
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;

    onChange({ target: { name, value: value ? parseFloat(value) : 0 } });
  };

  const enhancedFields = formFields.map((column) =>
    column.map((field) => {
      if (field.type === "number") {
        return {
          ...field,
          onKeyDown: preventInvalidKeys,
          onChange: handleNumberInput,
        };
      }
      return field;
    })
  );

  return (
    <div className="request-container border p-3 mb-2">
      {/* DESCRIPTION FIELD */}
      <Row className="mb-3">
        <Col md={12}>
          <FloatingLabel controlId="description" label="Description">
            <Form.Control
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={onChange}
              placeholder="Enter description"
              className="form-control-sm small-input"
            />
          </FloatingLabel>
        </Col>
      </Row>

      {/* DYNAMIC FIELDS */}
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
                    field.type === "number"
                      ? formData[field.name] ?? 0
                      : formData[field.name] || ""
                  }
                  onChange={field.onChange || onChange}
                  placeholder={field.label}
                  className="form-control-sm small-input"
                  min={field.min}
                  onKeyDown={field.onKeyDown}
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
