import html2pdf from "html2pdf.js";

/**
 * Converts a referenced HTML element into a downloadable PDF file.
 * @param {React.RefObject} ref - React ref pointing to the HTML content.
 * @param {string} filename - Desired filename for the PDF.
 */
const downloadPDF = async (ref, filename = "download.pdf") => {
  if (!ref?.current) return;

  const element = ref.current;

  const options = {
    margin: [0, 0.2, 0, 0.2],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a5", orientation: "landscape" },
  };

  await html2pdf().set(options).from(element).save();
};

export default downloadPDF;
