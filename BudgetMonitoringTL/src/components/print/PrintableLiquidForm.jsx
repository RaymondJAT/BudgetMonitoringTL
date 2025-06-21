import { Container } from "react-bootstrap";

const PrintableLiquidForm = ({ contentRef }) => {
  return (
    <div ref={contentRef}>
      <Container fluid>Printable LiquidForm</Container>
    </div>
  );
};

export default PrintableLiquidForm;
