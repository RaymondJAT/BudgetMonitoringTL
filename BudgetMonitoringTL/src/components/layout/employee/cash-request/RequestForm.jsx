import { useEffect, useState } from "react";
import { Row, Col, FloatingLabel, Form, Spinner } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { customStyles } from "../../../../constants/customStyles";

const RequestForm = ({
  fields = [],
  formData = {},
  onChange = () => {},
  amountInWords = "",
}) => {
  const [teamLeads, setTeamLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState(
    formData.team_lead
      ? { value: formData.team_lead, label: formData.team_lead }
      : null
  );
  const [inputValue, setInputValue] = useState("");

  const getField = (key) => fields.find((f) => f.key === key) || {};

  // TEAM LEADS FROM API
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
          label: `${lead.fullname}`,
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

  const handleTeamLeadChange = (selected) => {
    setSelectedTeamLead(selected);
    onChange({ target: { name: "team_lead", value: selected?.value || "" } });
  };

  // react-select CUSTOM STYLE
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
    menuList: (base) => {
      const isMobile = window.innerWidth < 768;
      return {
        ...base,
        maxHeight: isMobile ? "150px" : "90px",
        overflowY: "auto",
      };
    },
  };

  return (
    <div className="request-container border p-3">
      {/* PARTICULARS */}
      <Row className="mb-1">
        <Col xs={12}>
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
      </Row>

      {/* EMPLOYEE DETAILS */}
      <Row className="mb-1">
        {["employee", "department", "position"].map((key) => {
          const { label = "", type = "text" } = getField(key);
          return (
            <Col xs={12} md={4} key={key}>
              <FloatingLabel controlId={key} label={label} className="mb-1">
                <Form.Control
                  type={type}
                  name={key}
                  value={formData[key] || ""}
                  onChange={onChange}
                  placeholder={label}
                  readOnly
                  className="form-control-sm small-input"
                />
              </FloatingLabel>
            </Col>
          );
        })}
      </Row>

      <Row>
        {/* REQUEST DATE */}
        <Col xs={12} md={6} className="mb-1">
          <FloatingLabel
            controlId="request_date"
            label={getField("request_date")?.label || "Request Date"}
            className="mb-1"
          >
            <Form.Control
              type="date"
              name="request_date"
              value={
                formData.request_date || new Date().toISOString().split("T")[0]
              }
              onChange={onChange}
              placeholder="Request Date"
              className="form-control-sm small-input"
            />
          </FloatingLabel>
        </Col>

        {/* TEAM LEAD */}
        <Col xs={12} md={6} className="mb-1">
          <Form.Label className="small fw-semibold mb-1">
            {getField("team_lead")?.label || "Team Lead"}
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
              placeholder="Select Team Lead"
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
      <Row className="mb-1">
        <Col xs={12}>
          <strong>Amount in Words:</strong>
          <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
        </Col>
      </Row>
    </div>
  );
};

export default RequestForm;
