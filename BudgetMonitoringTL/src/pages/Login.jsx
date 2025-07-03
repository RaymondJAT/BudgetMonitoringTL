import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";

const Login = ({ setUserRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // authentication
    if (username === "employee" && password === "pass") {
      localStorage.setItem("role", "employee");
      localStorage.setItem("username", "Employee");
      setUserRole("employee");
      navigate("/");
    } else if (username === "teamlead" && password === "pass") {
      localStorage.setItem("role", "teamlead");
      localStorage.setItem("username", "Team Lead");
      setUserRole("teamlead");
      navigate("/");
    } else if (username === "admin" && password === "pass") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("username", "Admin");
      setUserRole("admin");
      navigate("/");
    } else if (username === "finance" && password === "pass") {
      localStorage.setItem("role", "finance");
      localStorage.setItem("username", "Finance");
      setUserRole("finance");
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to bottom right, #8B0000,rgb(45, 31, 31))",
      }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={5} lg={4}>
          <Card
            className="p-4"
            style={{
              borderRadius: "6px",
              background: "linear-gradient(145deg, #ffffff,rgb(211, 211, 211))",
              boxShadow: "10px 10px 25px rgba(0, 0, 0, 0.3)",
              border: "none",
              fontSize: "0.75rem",
            }}
          >
            <h3 className="text-center mb-4 fw-bold">Log In</h3>

            {error && (
              <Alert variant="danger" onClose={() => setError("")} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingUsername"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="custom-floating-input"
                />
                <label htmlFor="floatingUsername">Username</label>
              </Form.Floating>

              <Form.Floating className="mb-4">
                <Form.Control
                  id="floatingPassword"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="custom-floating-input"
                />
                <label htmlFor="floatingPassword">Password</label>
              </Form.Floating>

              <Button variant="outline-dark" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
