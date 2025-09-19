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
  Spinner,
} from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("api5001/login/check-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Invalid username or password");
        setLoading(false);
        return;
      }

      const { token, data } = result;

      // STORE LOGIN INFO
      localStorage.setItem("token", token);
      localStorage.setItem("username", data.fullname || data.username);
      localStorage.setItem("employee_fullname", data.employee_fullname);
      localStorage.setItem("employee_id", data.employee_id);
      localStorage.setItem("department_name", data.department_name);
      localStorage.setItem("position_name", data.position_name);
      localStorage.setItem("access_id", data.access);
      localStorage.setItem("access_name", data.access_name);

      // FETCH ACCESS RIGHTS
      const accessRes = await fetch(
        `/api5012/route_access/getroute_access_table?access_id=${data.access}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let userAccess = [];
      if (accessRes.ok) {
        const accessData = await accessRes.json();
        userAccess = accessData.data || [];
        localStorage.setItem("access", JSON.stringify(userAccess));
      } else {
        console.warn("Failed to fetch route access for user");
        localStorage.setItem("access", "[]");
      }

      let firstRoute = "/";
      switch (data.access) {
        case 10:
          firstRoute = "/employee_request";
          break;
        case 11:
          firstRoute = "/finance_dashboard";
          break;
        case 12:
          firstRoute = "/finance_dashboard";
          break;
        case 13:
          firstRoute = "/teamlead_pendings";
          break;
        default:
          if (userAccess.length > 0) {
            const routeWithPath = userAccess.find((item) => item.path);
            if (routeWithPath) firstRoute = routeWithPath.path;
          }
      }

      navigate(firstRoute);
      window.location.reload();
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
      setLoading(false);
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <label htmlFor="floatingPassword">Password</label>
              </Form.Floating>

              <Button
                variant="outline-dark"
                type="submit"
                className="w-100 d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />{" "}
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
