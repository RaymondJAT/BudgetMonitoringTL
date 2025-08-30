import { Row, Col } from "react-bootstrap";

const ProgressBar = ({ steps, currentStep, onStepClick }) => {
  const getStepStatus = (index) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "upcoming";
  };

  return (
    <div className="progress-bar-container">
      <Row className="justify-content-center g-0">
        <Col className="p-0">
          <div className="progress-wrapper">
            {steps.map((step, index) => {
              const status = getStepStatus(index);

              return (
                <div
                  key={index}
                  className={`progress-step ${status}`}
                  onClick={() => onStepClick?.(index, step)}
                  style={{ cursor: onStepClick ? "pointer" : "default" }}
                >
                  <div className="step-arrow-body">
                    <span className="step-label">{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

ProgressBar.defaultProps = {
  steps: [
    { label: "Submitted", value: "submitted" },
    { label: "Under Review", value: "review" },
    { label: "Approved", value: "approved" },
    { label: "Disbursed", value: "disbursed" },
    { label: "Completed", value: "completed" },
  ],
  currentStep: 0,
  onStepClick: null,
};

export default ProgressBar;
