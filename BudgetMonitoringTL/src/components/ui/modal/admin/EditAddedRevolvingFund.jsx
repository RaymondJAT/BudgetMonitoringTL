import { useState, useEffect } from "react";
import { Modal, FloatingLabel, Form, Row, Col, Spinner } from "react-bootstrap";
import AppButton from "../../buttons/AppButton";

const EditAddedRevolvingFund = ({ show, onHide, fundData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [addedAmount, setAddedAmount] = useState("");
  const [focused, setFocused] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Reset modal each open
  useEffect(() => {
    if (fundData && show) {
      console.log("🧾 EditAddedRevolvingFund opened:", fundData);
      setAddedAmount(fundData.added || "");
    }
  }, [fundData, show]);

  // 🔹 Format Peso
  const formatPeso = (val) => {
    if (val === "" || val == null || isNaN(val)) return "";
    return (
      "₱" +
      Number(val).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  // 🔹 Compute total dynamically
  const totalFund = (() => {
    const beginning = parseFloat(fundData?.beginning || 0);
    const added = parseFloat(addedAmount || 0);
    return beginning + added;
  })();

  // 🔹 Save updated amount
  const handleSave = async () => {
    try {
      setLoading(true);
      const parsedAmount = parseFloat(addedAmount) || 0;

      const res = await fetch("/api5001/revolving_fund/update_total_fund", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: fundData.id,
          beginning_amount: fundData.beginning || 0,
          added_amount: parsedAmount,
        }),
      });

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      await res.json();

      if (typeof onSuccess === "function") onSuccess();
      onHide();
    } catch (err) {
      console.error("❌ Failed to update fund:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Edit Revolving Fund
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000", color: "#fff" }}>
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="light" />
            <div className="mt-2">Updating Fund...</div>
          </div>
        ) : (
          <Form className="text-white">
            <Row className="g-2">
              {/* Beginning Amount (readonly) */}
              <Col md={4}>
                <FloatingLabel
                  controlId="beginningAmount"
                  label="Beginning Amount"
                  className="text-dark"
                  style={{ fontSize: "0.85rem" }}
                >
                  <Form.Control
                    type="text"
                    value={formatPeso(fundData?.beginning || 0)}
                    readOnly
                    style={{
                      height: "50px",
                      fontSize: "0.85rem",
                      backgroundColor: "#f8f9fa",
                      color: "#495057",
                    }}
                  />
                </FloatingLabel>
              </Col>

              {/* Added Amount (editable) */}
              <Col md={4}>
                <FloatingLabel
                  controlId="addedAmount"
                  label="Added Amount"
                  className="text-dark"
                  style={{ fontSize: "0.85rem" }}
                >
                  <Form.Control
                    type="text"
                    placeholder="₱0.00"
                    value={
                      focused
                        ? addedAmount ?? ""
                        : addedAmount !== "" && addedAmount != null
                        ? formatPeso(addedAmount)
                        : ""
                    }
                    onChange={(e) => {
                      let raw = e.target.value;
                      if (!/^\d*\.?\d*$/.test(raw)) return; // digits and decimals only
                      setAddedAmount(raw === "" ? "" : raw);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      if (addedAmount !== "" && !isNaN(addedAmount)) {
                        setAddedAmount(parseFloat(addedAmount));
                      }
                      setFocused(false);
                    }}
                    style={{ height: "50px", fontSize: "0.85rem" }}
                    required
                    className="form-control-sm"
                  />
                </FloatingLabel>
              </Col>

              {/* Total Fund (readonly) */}
              <Col md={4}>
                <FloatingLabel
                  controlId="totalFund"
                  label="Total Fund"
                  className="text-dark"
                  style={{ fontSize: "0.85rem" }}
                >
                  <Form.Control
                    type="text"
                    value={formatPeso(totalFund)}
                    readOnly
                    style={{
                      height: "50px",
                      fontSize: "0.85rem",
                      backgroundColor: "#f8f9fa",
                      color: "#495057",
                    }}
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Cancel"
          variant="outline-danger"
          onClick={onHide}
          className="custom-app-button"
        />
        <AppButton
          label="Save"
          variant="outline-success"
          onClick={handleSave}
          disabled={loading || addedAmount === ""}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EditAddedRevolvingFund;
