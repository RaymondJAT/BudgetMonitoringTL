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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("api/login/check-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        const { token, data } = result;

        // Optional: Save JWT token for future requests
        localStorage.setItem("token", token);

        // Save user info
        localStorage.setItem("username", data.fullname || data.username);

        // Convert access level to role name
        let role = "";
        switch (data.position) {
          case "admin":
            role = "admin";
            break;
          case "employee":
            role = "employee";
            break;
          case "teamlead":
            role = "teamlead";
            break;
          case "finance":
            role = "finance";
            break;
          default:
            role = "employee";
        }

        localStorage.setItem("role", role);
        setUserRole(role);

        // Redirect to proper path
        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "finance":
            navigate("/");
            break;
          case "employee":
            navigate("/employee");
            break;

          case "teamlead":
            navigate("/teamlead");
            break;
          default:
            navigate("/login");
        }
      } else {
        setError(result.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
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
