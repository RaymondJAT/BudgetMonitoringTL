import { Container, Row, Col } from "react-bootstrap";

const ProgressBar = ({ steps, currentStep, onStepClick }) => {
  const getStepStatus = (index) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "upcoming";
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col>
          <div className="d-flex justify-content-center">
            {steps.map((step, index) => {
              const status = getStepStatus(index);

              return (
                <div
                  key={index}
                  className={`progress-step ${status}`}
                  onClick={() => onStepClick?.(index, step)}
                  style={{ cursor: onStepClick ? "pointer" : "default" }}
                >
                  <div className="step-arrow-body d-flex align-items-center justify-content-center px-3">
                    <small className="step-label text-truncate">
                      {step.label}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

ProgressBar.defaultProps = {
  steps: [
    { label: "Submitted", value: "submitted" },
    { label: "Under Review", value: "review" },
    { label: "Approved", value: "approved" },
    { label: "Processed", value: "processed" },
    { label: "Completed", value: "completed" },
  ],
  currentStep: 0,
  onStepClick: null,
};

export default ProgressBar;
