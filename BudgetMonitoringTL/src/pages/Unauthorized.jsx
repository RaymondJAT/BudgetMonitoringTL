import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-3 fw-bold text-danger">403</h1>
      <h2 className="mb-3 text-white">Access Denied</h2>
      <p className="mb-4 text-white">
        Sorry, you don’t have permission to view this page.
      </p>
      <Button
        variant="outline-dark"
        className="custom-app-button"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </div>
  );
};

export default Unauthorized;
