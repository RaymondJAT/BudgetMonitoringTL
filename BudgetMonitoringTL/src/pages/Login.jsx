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
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      // Fetch access rights
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
      }

      const hasNoAccess =
        userAccess.length === 0 ||
        userAccess.every(
          (item) =>
            item.status?.toLowerCase() === "no access" ||
            item.path === null ||
            item.path === ""
        );

      if (hasNoAccess) {
        setError(
          "Your account has no access. Please contact the administrator."
        );
        setLoading(false);
        localStorage.clear();
        return;
      }

      // Save token + user info
      localStorage.setItem("token", token);
      localStorage.setItem("username", data.fullname || data.username);
      localStorage.setItem("employee_fullname", data.employee_fullname);
      localStorage.setItem("employee_id", data.employee_id);
      localStorage.setItem("department_name", data.department_name);
      localStorage.setItem("position_name", data.position_name);
      localStorage.setItem("access_id", data.access);
      localStorage.setItem("access_name", data.access_name);
      localStorage.setItem("access", JSON.stringify(userAccess));

      // Decide first route
      let firstRoute = "/";
      switch (data.access) {
        case 10:
          firstRoute = "/employee_request";
          break;
        case 12:
          firstRoute = "/final_approval";
          break;
        case 20:
        case 11:
          firstRoute = "/finance_dashboard";
          break;
        case 13:
          firstRoute = "/teamlead_pendings";
          break;
        default:
          const routeWithPath = userAccess.find((item) => item.path);
          if (routeWithPath) firstRoute = routeWithPath.path;
      }

      // Save first route for auto redirect after reload
      localStorage.setItem("firstRoute", firstRoute);

      // Navigate immediately
      navigate(firstRoute, { replace: true });
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
        background:
          "linear-gradient(to bottom right, #8B0000, rgb(45, 31, 31))",
      }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={7}>
          <Card
            className="overflow-hidden"
            style={{
              borderRadius: "12px",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
              border: "none",
            }}
          >
            <Row className="g-0">
              {/* Left branding */}
              <Col
                md={6}
                className="d-none d-md-flex flex-column justify-content-center align-items-center text-white"
                style={{
                  background: "linear-gradient(145deg, #8B0000, #5a0000)",
                  padding: "2rem",
                }}
              >
                <h2 className="fw-bold mb-3">Welcome to BMS</h2>
                <p className="text-light text-center">
                  Manage requests and funds with ease.
                </p>
              </Col>

              {/* Right login form */}
              <Col md={6} xs={12}>
                <div className="p-4">
                  <h3 className="text-center mb-4 fw-bold">Log In</h3>

                  {error && (
                    <Alert
                      variant="danger"
                      onClose={() => setError("")}
                      dismissible
                    >
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Username */}
                    <Form.Floating className="mb-3">
                      <Form.Control
                        id="floatingUsername"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        className="form-control-sm"
                      />
                      <label htmlFor="floatingUsername">Username</label>
                    </Form.Floating>

                    {/* Password */}
                    <div className="position-relative mb-4">
                      <Form.Floating>
                        <Form.Control
                          id="floatingPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="form-control-sm"
                        />
                        <label htmlFor="floatingPassword">Password</label>
                      </Form.Floating>

                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#6c757d",
                          fontSize: "1rem",
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>

                    {/* Button */}
                    <Button
                      variant="dark"
                      type="submit"
                      className="w-100 d-flex align-items-center justify-content-center shadow-sm"
                      disabled={loading}
                      style={{
                        background: "linear-gradient(90deg, #8B0000, #a83232)",
                        border: "none",
                        fontWeight: "600",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        fontSize: "1rem",
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
