import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = async (ref, filename = "download.pdf") => {
  if (!ref?.current) {
    console.error("❌ downloadRef is invalid or not set.");
    return;
  }

  try {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true, // ✅ helpful if images from external sources are used
    });

    const imgData = canvas.toDataURL("image/png");

    // Double-check the result
    if (!imgData || !imgData.startsWith("data:image/png")) {
      throw new Error("Generated image data is invalid or corrupted.");
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("❌ PDF download failed:", error);
  }
};
