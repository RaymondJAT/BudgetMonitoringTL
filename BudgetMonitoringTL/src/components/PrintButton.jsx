import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import PrintModal from "./PrintModal";
import { useReactToPrint } from "react-to-print";

const PrintButton = ({ data, amountInWords }) => {
  const printRef = useRef(); // Reference for the modal content

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Cash Request Form",
    onPrintError: (error) => console.error("Print Error:", error),
  });

  return (
    <div>
      <Button onClick={handlePrint}>Print</Button>
      {/* Attach the reference to the PrintModal */}
      <div style={{ display: "none" }}>
        <PrintModal
          ref={printRef}
          show={true}
          data={data}
          amountInWords={amountInWords}
        />
      </div>
    </div>
  );
};

export default PrintButton;
