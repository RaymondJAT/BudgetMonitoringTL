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
      setUserRole("employee");
      navigate("/");
    } else if (username === "teamlead" && password === "pass") {
      localStorage.setItem("role", "teamlead");
      setUserRole("teamlead");
      navigate("/");
    } else if (username === "admin" && password === "pass") {
      localStorage.setItem("role", "admin");
      setUserRole("admin");
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={5} lg={4}>
          <Card className="shadow-sm p-4">
            <h3 className="text-center mb-4">Sign In</h3>

            {error && (
              <Alert variant="danger" onClose={() => setError("")} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>

            <div
              className="mt-3 text-center text-muted"
              style={{ fontSize: "0.85rem" }}
            >
              <p>
                Demo credentials:
                <br />
                <b>employee</b> / pass
                <br />
                <b>teamlead</b> / pass
                <br />
                <b>admin</b> / pass
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
