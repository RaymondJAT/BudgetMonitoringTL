import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Table, Form } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../../ui/buttons/AppButton";

const LiquidTable = ({ tableRows, onRowChange, onAddRow, onRemoveRow }) => {
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);

  // Dropdown options
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);

  // Input values for each row and field
  const [fromInputs, setFromInputs] = useState({});
  const [toInputs, setToInputs] = useState({});
  const [transportInputs, setTransportInputs] = useState({});

  const formatPeso = (val) =>
    "₱" +
    Number(val || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Fetch dropdown options once
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOptions = async (url, setter, key) => {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const unique = [...new Set(data.map((item) => item[key]))];
        setter(unique.map((val) => ({ value: val, label: val })));
      } catch (err) {
        console.error(`Error fetching ${key}:`, err);
      }
    };

    fetchOptions(
      `/api5012/liquidation_item/getliquidation_item_started_from`,
      setFromOptions,
      "started_from"
    );
    fetchOptions(
      `/api5012/liquidation_item/getliquidation_item_ended_to`,
      setToOptions,
      "ended_to"
    );
    fetchOptions(
      `/api5012/liquidation_item/getliquidation_item_mode_of_transportation`,
      setTransportOptions,
      "mode_of_transportation"
    );
  }, []);

  const handleRowChange = (index, field, value) => {
    onRowChange(index, field, value);

    if (["date", "rt", "store_name", "particulars"].includes(field)) {
      for (let i = index + 1; i < tableRows.length; i++) {
        if (tableRows[i].isHiddenRow) onRowChange(i, field, value);
        else break;
      }
    }
  };

  const handleAddRow = (baseRow, isBottomAdd = false, clickedIndex = null) => {
    let newRow = {
      date: "",
      rt: "",
      store_name: "",
      particulars: "",
      from: "",
      to: "",
      mode_of_transportation: "",
      amount: "",
      isHiddenRow: false,
    };

    if (!isBottomAdd) {
      const clickedBase = tableRows[clickedIndex];
      newRow = {
        ...newRow,
        date: clickedBase.date || "",
        rt: clickedBase.rt || "",
        store_name: clickedBase.store_name || "",
        particulars: clickedBase.particulars || "",
        isHiddenRow: true,
      };

      let insertAt = clickedIndex + 1;
      for (let i = clickedIndex + 1; i < tableRows.length; i++) {
        if (tableRows[i].isHiddenRow) insertAt = i + 1;
        else break;
      }
      onAddRow(newRow, insertAt);
    } else {
      onAddRow(newRow);
    }
  };

  const handleRemoveRow = (index) => onRemoveRow(index);

  // Handle CreatableSelect change for all fields
  const handleSelectChange = (index, field, selected) => {
    const value = selected?.value || "";
    handleRowChange(index, field, value);

    // Clear the input value when a selection is made
    switch (field) {
      case "from":
        setFromInputs((prev) => ({ ...prev, [index]: "" }));
        break;
      case "to":
        setToInputs((prev) => ({ ...prev, [index]: "" }));
        break;
      case "mode_of_transportation":
        setTransportInputs((prev) => ({ ...prev, [index]: "" }));
        break;
      default:
        break;
    }
  };

  // Handle input change for custom typing
  const handleInputChange = (index, field, inputValue, action) => {
    if (action !== "menu-close" && action !== "input-blur") {
      switch (field) {
        case "from":
          setFromInputs((prev) => ({ ...prev, [index]: inputValue }));
          break;
        case "to":
          setToInputs((prev) => ({ ...prev, [index]: inputValue }));
          break;
        case "mode_of_transportation":
          setTransportInputs((prev) => ({ ...prev, [index]: inputValue }));
          break;
        default:
          break;
      }
    }
  };

  // Handle blur to save custom input and add to options
  const handleSelectBlur = (index, field, inputValue) => {
    if (inputValue && inputValue.trim() !== "") {
      const trimmedValue = inputValue.trim();

      // Update the row data with the custom input
      handleRowChange(index, field, trimmedValue);

      // Add the custom value to the options if it doesn't exist
      switch (field) {
        case "from":
          if (!fromOptions.some((option) => option.value === trimmedValue)) {
            const newOption = { value: trimmedValue, label: trimmedValue };
            setFromOptions((prev) => [...prev, newOption]);
          }
          setFromInputs((prev) => ({ ...prev, [index]: "" }));
          break;
        case "to":
          if (!toOptions.some((option) => option.value === trimmedValue)) {
            const newOption = { value: trimmedValue, label: trimmedValue };
            setToOptions((prev) => [...prev, newOption]);
          }
          setToInputs((prev) => ({ ...prev, [index]: "" }));
          break;
        case "mode_of_transportation":
          if (
            !transportOptions.some((option) => option.value === trimmedValue)
          ) {
            const newOption = { value: trimmedValue, label: trimmedValue };
            setTransportOptions((prev) => [...prev, newOption]);
          }
          setTransportInputs((prev) => ({ ...prev, [index]: "" }));
          break;
        default:
          break;
      }
    }
  };

  // react-select styles with mobile support - same as RequestForm
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
    <div
      className="liquid-table-wrapper border table-responsive-md"
      style={{
        maxHeight: "60vh",
        overflowY: "auto",
        padding: "0.5rem", // equal outer gap
      }}
    >
      <Table
        size="sm"
        className="request-table align-middle d-none d-md-table"
        style={{
          borderSpacing: "8px 6px", // add horizontal & vertical gaps between cells
          borderCollapse: "separate",
          width: "100%",
        }}
      >
        <thead className="table-light small-input">
          <tr className="text-center">
            <th>Date</th>
            <th>RT#</th>
            <th>Store Name</th>
            <th>Purpose</th>
            <th>From</th>
            <th>To</th>
            <th>Mode of Transportation</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              {/* DATE */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type={row.date === "N/A" ? "text" : "date"}
                    value={row.date}
                    onChange={(e) =>
                      handleRowChange(index, "date", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                    style={{ width: "110px" }}
                  />
                ) : (
                  <input type="hidden" value={row.date} />
                )}
              </td>

              {/* RT */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type="text"
                    value={row.rt}
                    onChange={(e) =>
                      handleRowChange(index, "rt", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                    style={{ width: "80px" }}
                  />
                ) : (
                  <input type="hidden" value={row.rt} />
                )}
              </td>

              {/* STORE NAME */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type="text"
                    value={row.store_name}
                    onChange={(e) =>
                      handleRowChange(index, "store_name", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                    style={{ width: "160px" }}
                  />
                ) : (
                  <input type="hidden" value={row.store_name} />
                )}
              </td>

              {/* PARTICULARS */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type="text"
                    value={row.particulars}
                    onChange={(e) =>
                      handleRowChange(index, "particulars", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                    style={{ width: "250px" }}
                  />
                ) : (
                  <input type="hidden" value={row.particulars} />
                )}
              </td>

              {/* FROM */}
              <td className="text-center p-1" style={{ width: "200px" }}>
                <CreatableSelect
                  value={row.from ? { value: row.from, label: row.from } : null}
                  onChange={(selected) =>
                    handleSelectChange(index, "from", selected)
                  }
                  onInputChange={(inputValue, { action }) =>
                    handleInputChange(index, "from", inputValue, action)
                  }
                  onBlur={() =>
                    handleSelectBlur(index, "from", fromInputs[index])
                  }
                  options={fromOptions}
                  styles={selectInputStyles}
                  isClearable
                  placeholder="Select"
                  inputValue={fromInputs[index] || ""}
                />
              </td>

              {/* TO */}
              <td className="text-center p-1" style={{ width: "200px" }}>
                <CreatableSelect
                  value={row.to ? { value: row.to, label: row.to } : null}
                  onChange={(selected) =>
                    handleSelectChange(index, "to", selected)
                  }
                  onInputChange={(inputValue, { action }) =>
                    handleInputChange(index, "to", inputValue, action)
                  }
                  onBlur={() => handleSelectBlur(index, "to", toInputs[index])}
                  options={toOptions}
                  styles={selectInputStyles}
                  isClearable
                  placeholder="Select"
                  inputValue={toInputs[index] || ""}
                />
              </td>

              {/* MODE OF TRANSPORTATION */}
              <td className="text-center p-1" style={{ width: "200px" }}>
                <CreatableSelect
                  value={
                    row.mode_of_transportation
                      ? {
                          value: row.mode_of_transportation,
                          label: row.mode_of_transportation,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleSelectChange(
                      index,
                      "mode_of_transportation",
                      selected
                    )
                  }
                  onInputChange={(inputValue, { action }) =>
                    handleInputChange(
                      index,
                      "mode_of_transportation",
                      inputValue,
                      action
                    )
                  }
                  onBlur={() =>
                    handleSelectBlur(
                      index,
                      "mode_of_transportation",
                      transportInputs[index]
                    )
                  }
                  options={transportOptions}
                  styles={selectInputStyles}
                  isClearable
                  placeholder="Select"
                  inputValue={transportInputs[index] || ""}
                />
              </td>

              {/* AMOUNT */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  placeholder="₱0.00"
                  value={
                    focusedRowIndex === index
                      ? row.amount ?? ""
                      : row.amount == null ||
                        row.amount === "" ||
                        row.amount === "N/A"
                      ? ""
                      : formatPeso(row.amount)
                  }
                  onChange={(e) => {
                    const input = e.target.value.trim();
                    if (/^[Nn][\/-]?[Aa]$/.test(input)) {
                      handleRowChange(index, "amount", "N/A");
                    } else {
                      let raw = input.replace(/[^0-9.]/g, "");
                      const parts = raw.split(".");
                      if (parts.length > 2) raw = parts[0] + "." + parts[1];
                      handleRowChange(index, "amount", raw);
                    }
                  }}
                  onBlur={() => {
                    if (row.amount !== "" && !isNaN(row.amount)) {
                      handleRowChange(index, "amount", parseFloat(row.amount));
                    } else if (row.amount === "" || row.amount == null) {
                      handleRowChange(index, "amount", "N/A");
                    }
                    setFocusedRowIndex(null);
                  }}
                  onFocus={() => setFocusedRowIndex(index)}
                  size="sm"
                  className="form-control-sm text-center mx-auto"
                  style={{ width: "100px" }}
                />
              </td>

              {/* ACTION BUTTONS */}
              <td className="text-center p-2 d-flex justify-content-center gap-1">
                <AppButton
                  label="+"
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleAddRow(row, false, index)}
                />
                <AppButton
                  label={<FiTrash2 className="trash-icon" />}
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveRow(index)}
                />
              </td>
            </tr>
          ))}

          {/* ADD ROW BUTTON */}
          <tr>
            <td colSpan="9" className="text-center p-2">
              <AppButton
                label="+"
                variant="outline-dark"
                size="sm"
                onClick={() => handleAddRow(null, true)}
                className="add-circle-btn mx-auto"
              />
            </td>
          </tr>
        </tbody>
      </Table>

      {/* MOBILE VIEW */}
      <div className="d-md-none">
        {tableRows.map((row, index) => (
          <div
            key={index}
            className="liquid-card border rounded-3 p-2 mb-2"
            style={{ fontSize: "0.875rem" }}
          >
            <div className="mb-2 text-center" style={{ fontSize: "1.2rem" }}>
              •••
            </div>

            <div className="d-flex flex-column gap-1 small">
              {!row.isHiddenRow && (
                <>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type={row.date === "N/A" ? "text" : "date"}
                      value={row.date}
                      onChange={(e) =>
                        handleRowChange(index, "date", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>RT#</Form.Label>
                    <Form.Control
                      type="text"
                      value={row.rt}
                      onChange={(e) =>
                        handleRowChange(index, "rt", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Store Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={row.store_name}
                      onChange={(e) =>
                        handleRowChange(index, "store_name", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Purpose</Form.Label>
                    <Form.Control
                      type="text"
                      value={row.particulars}
                      onChange={(e) =>
                        handleRowChange(index, "particulars", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>
                </>
              )}

              {/* FROM */}
              <Form.Group>
                <Form.Label>From</Form.Label>
                <CreatableSelect
                  value={row.from ? { value: row.from, label: row.from } : null}
                  onChange={(selected) =>
                    handleSelectChange(index, "from", selected)
                  }
                  onInputChange={(inputValue, { action }) =>
                    handleInputChange(index, "from", inputValue, action)
                  }
                  onBlur={() =>
                    handleSelectBlur(index, "from", fromInputs[index])
                  }
                  options={fromOptions}
                  styles={selectInputStyles}
                  isClearable
                  placeholder="Select"
                  inputValue={fromInputs[index] || ""}
                />
              </Form.Group>

              {/* TO */}
              <Form.Group>
                <Form.Label>To</Form.Label>
                <CreatableSelect
                  value={row.to ? { value: row.to, label: row.to } : null}
                  onChange={(selected) =>
                    handleSelectChange(index, "to", selected)
                  }
                  onInputChange={(inputValue, { action }) =>
                    handleInputChange(index, "to", inputValue, action)
                  }
                  onBlur={() => handleSelectBlur(index, "to", toInputs[index])}
                  options={toOptions}
                  styles={selectInputStyles}
                  isClearable
                  placeholder="Select"
                  inputValue={toInputs[index] || ""}
                />
              </Form.Group>

              {/* MODE OF TRANSPORTATION */}
              <Form.Group>
                <Form.Label>Mode of Transportation</Form.Label>
                <CreatableSelect
                  value={
                    row.mode_of_transportation
                      ? {
                          value: row.mode_of_transportation,
                          label: row.mode_of_transportation,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleSelectChange(
                      index,
                      "mode_of_transportation",
                      selected
                    )
                  }
                  onInputChange={(inputValue, { action }) =>
                    handleInputChange(
                      index,
                      "mode_of_transportation",
                      inputValue,
                      action
                    )
                  }
                  onBlur={() =>
                    handleSelectBlur(
                      index,
                      "mode_of_transportation",
                      transportInputs[index]
                    )
                  }
                  options={transportOptions}
                  styles={selectInputStyles}
                  isClearable
                  placeholder="Select"
                  inputValue={transportInputs[index] || ""}
                />
              </Form.Group>

              {/* AMOUNT */}
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="₱0.00"
                  value={
                    focusedRowIndex === index
                      ? row.amount ?? ""
                      : row.amount == null ||
                        row.amount === "" ||
                        row.amount === "N/A"
                      ? ""
                      : formatPeso(row.amount)
                  }
                  onChange={(e) => {
                    const input = e.target.value.trim();
                    if (/^[Nn][\/-]?[Aa]$/.test(input)) {
                      handleRowChange(index, "amount", "N/A");
                    } else {
                      let raw = input.replace(/[^0-9.]/g, "");
                      const parts = raw.split(".");
                      if (parts.length > 2) raw = parts[0] + "." + parts[1];
                      handleRowChange(index, "amount", raw);
                    }
                  }}
                  onBlur={() => {
                    if (row.amount !== "" && !isNaN(row.amount)) {
                      handleRowChange(index, "amount", parseFloat(row.amount));
                    } else if (row.amount === "" || row.amount == null) {
                      handleRowChange(index, "amount", "N/A");
                    }
                    setFocusedRowIndex(null);
                  }}
                  onFocus={() => setFocusedRowIndex(index)}
                  size="sm"
                />
              </Form.Group>

              <div className="d-flex justify-content-center gap-2 mt-2">
                <AppButton
                  label="+"
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleAddRow(row, false, index)}
                />
                <AppButton
                  label={<FiTrash2 className="trash-icon" />}
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveRow(index)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-center my-2">
          <AppButton
            label="+"
            variant="outline-dark"
            size="sm"
            onClick={() => handleAddRow(null, true)}
            className="add-circle-btn"
          />
        </div>
      </div>
    </div>
  );
};

export default LiquidTable;
