import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import moment from "moment";
import useRegistrations from "../hooks/useRegistrations";
import useCourses from "../hooks/useCourses";
import useBatch from "../hooks/useBatch";
import useSettings from "../hooks/useSettings";

const DownloadInvoice = ({ uid }) => {
  const { downloadInvoice, setDownloadInvoice } = useSettings();

  const [registrationDetails, setRegistrationDetails] = useState({});
  const [batchDetails, setBatchDetails] = useState({});
  const [courseDetails, setCourseDetails] = useState({});

  const getRegistrationDetails = useRegistrations(uid);
  const getCourseDetails = useCourses(
    registrationDetails?.course || "000000000000000000000000"
  );
  const getBatchDetails = useBatch(
    registrationDetails?.batch || "000000000000000000000000"
  );

  useEffect(() => {
    if (!getRegistrationDetails?.isLoading) {
      setRegistrationDetails(getRegistrationDetails?.data?.[0]);
      console.log(getRegistrationDetails?.data?.[0]);
    }
    if (!getCourseDetails?.isLoading) {
      setCourseDetails(getCourseDetails?.[0]);
      console.log(getCourseDetails);
    }
    if (!getBatchDetails?.isLoading) {
      setBatchDetails(getBatchDetails);
      console.log(getBatchDetails);
    }
  }, [getRegistrationDetails, getCourseDetails, getBatchDetails]);

  useEffect(() => {
    const handleDownloadInvoice = async () => {
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
            courseDetails?.[0]?.name
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
      !getCourseDetails?.isLoading &&
      !getBatchDetails?.isLoading &&
      downloadInvoice
    ) {
      setDownloadInvoice(false);
      console.log("courseDetails", courseDetails);
      if (downloadInvoice) {
        handleDownloadInvoice();
      }
    }
  }, [
    getRegistrationDetails,
    getCourseDetails,
    getBatchDetails,
    batchDetails,
    courseDetails,
    registrationDetails,
    downloadInvoice,
    setDownloadInvoice,
  ]);

  return "";
};

export default DownloadInvoice;
