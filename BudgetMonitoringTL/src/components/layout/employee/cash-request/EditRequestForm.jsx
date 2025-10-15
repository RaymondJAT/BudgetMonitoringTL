import { useState, useEffect } from "react";
import { Row, Col, FloatingLabel, Form, Spinner } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { customStyles } from "../../../../constants/customStyles";
import CashReqTable from "./CashReqTable";

const EditRequestForm = ({
  formData = {},
  onChange = () => {},
  amountInWords = "",
  amount = 0,
  onAmountChange = () => {},
  onClear = () => {},
}) => {
  const [teamLeads, setTeamLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState(
    formData.team_lead
      ? { value: formData.team_lead, label: formData.team_lead }
      : null
  );
  const [inputValue, setInputValue] = useState("");

  // Fetch Team Leads from API
  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        setLoadingLeads(true);
        const token = localStorage.getItem("token");
        const res = await fetch("/api5001/users/getusers_team_leader", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const options = (data?.data || []).map((lead) => ({
          value: lead.fullname,
          label: lead.fullname,
        }));
        setTeamLeads(options);
      } catch (err) {
        console.error("Error fetching team leads:", err);
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchTeamLeads();
  }, []);

  // Handle selection or creation of new Team Lead
  const handleTeamLeadChange = (selected) => {
    setSelectedTeamLead(selected);
    onChange({ target: { name: "team_lead", value: selected?.value || "" } });
  };

  // Custom react-select styling
  const selectInputStyles = {
    ...customStyles,
    control: (base, state) => ({
      ...base,
      minHeight: "31px",
      height: "31px",
      fontSize: "0.825rem",
      borderRadius: "0.2rem",
      paddingLeft: "2px",
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.15rem rgba(13,110,253,.25)"
        : "none",
      "&:hover": { borderColor: "#86b7fe" },
    }),
    valueContainer: (base) => ({
      ...base,
      height: "31px",
      padding: "0 4px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "31px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: window.innerWidth < 768 ? "150px" : "90px",
      overflowY: "auto",
    }),
  };

  return (
    <div className="request-edit-grid">
      <div className="request-container border p-3">
        <Row className="g-2 mb-1">
          {/* PARTICULARS */}
          <Col xs={12} md={7}>
            <FloatingLabel
              controlId="description"
              label="Particulars"
              className="mb-1"
            >
              <Form.Control
                as="textarea"
                rows={1}
                name="description"
                value={formData.description || ""}
                onChange={onChange}
                placeholder="Description"
                className="form-control-sm small-input"
              />
            </FloatingLabel>
          </Col>

          {/* TEAM LEAD (Dynamic) */}
          <Col xs={12} md={5}>
            <Form.Label className="small fw-semibold mb-1">
              Team Lead
            </Form.Label>
            {loadingLeads ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>Loading team leads...</span>
              </div>
            ) : (
              <CreatableSelect
                value={selectedTeamLead}
                onChange={(selected) => {
                  handleTeamLeadChange(selected);
                  setInputValue("");
                }}
                options={teamLeads}
                styles={selectInputStyles}
                isClearable
                placeholder="Select or type team lead"
                inputValue={inputValue}
                onInputChange={(val, { action }) => {
                  if (action !== "menu-close" && action !== "input-blur") {
                    setInputValue(val);
                  }
                }}
                onBlur={() => {
                  if (
                    inputValue &&
                    !teamLeads.some((o) => o.value === inputValue)
                  ) {
                    const newOption = { value: inputValue, label: inputValue };
                    setTeamLeads((prev) => [...prev, newOption]);
                    handleTeamLeadChange(newOption);
                  }
                }}
              />
            )}
          </Col>
        </Row>

        {/* AMOUNT IN WORDS */}
        <Row className="mb-2">
          <Col xs={12}>
            <strong>Amount in Words:</strong>
            <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
          </Col>
        </Row>
      </div>

      <div className="cashreq-table-container mt-3">
        <CashReqTable
          amount={amount}
          onAmountChange={onAmountChange}
          onClear={onClear}
        />
      </div>
    </div>
  );
};

export default EditRequestForm;
