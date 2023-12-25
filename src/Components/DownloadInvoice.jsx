import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import moment from "moment";
import useRegistrations from "../hooks/useRegistrations";
import useCourses from "../hooks/useCourses";
import useBatch from "../hooks/useBatch";

const DownloadInvoice = ({ uid }) => {
  const [registrationDetails, setRegistrationDetails] = useState({});
  const getRegistrationDetails = useRegistrations(uid);
  const courseDetails = useCourses(registrationDetails?.course || "");
  const batchDetails = useBatch(
    registrationDetails?.course || "000",
    registrationDetails?.batch || "000"
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!getRegistrationDetails?.isLoading) {
        setRegistrationDetails(getRegistrationDetails?.[0]);
      }
    };

    fetchData();
  }, [getRegistrationDetails]);

  useEffect(() => {
    const handleDownloadInvoice = () => {
      const doc = new jsPDF("p", "mm", "a4");

      doc
        .setFontSize(25)
        .setFont("Helvetica")
        .text("BRAVE EDUCATION", 15, 20)
        .setFontSize(12)
        .text(
          `Registration: ${moment(registrationDetails?.registeredOn).format(
            "DD MMMM YYYY [at] hh:MMa"
          )}`,
          15,
          30
        )
        .text(
          `${registrationDetails?.batch ? "Course" : "Test"}: ${
            courseDetails?.name
          }`,
          15,
          40
        )
        .text(`Batch: ${batchDetails?.name}`, 15, 46)
        .text(`Routine: ${batchDetails?.schedule}`, 15, 52)
        .text(`Name: ${registrationDetails?.name}`, 15, 62)
        .text(`Phone: ${registrationDetails?.phone}`, 15, 68)
        .text(`Email: ${registrationDetails?.email}`, 15, 74)
        .text(`Gender: ${registrationDetails?.gender}`, 15, 80)
        .text(`Price: ${courseDetails?.offerPrice}`, 15, 90)
        .setTextColor("navy")
        .text(`${registrationDetails?.paid ? "PAID" : "NOT PAID"}`, 15, 96);

      // Save the PDF
      doc.save("invoice.pdf");
    };

    if (
      !getRegistrationDetails?.isLoading &&
      !courseDetails?.isLoading &&
      !batchDetails?.isLoading
    ) {
      handleDownloadInvoice();
    }
  }, [
    getRegistrationDetails,
    courseDetails,
    batchDetails,
    registrationDetails,
  ]);

  return null;
};

export default DownloadInvoice;
