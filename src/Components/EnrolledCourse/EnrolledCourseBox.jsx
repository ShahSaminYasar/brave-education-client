import { FaCheckDouble } from "react-icons/fa6";
import useCourses from "../../hooks/useCourses";
import moment from "moment";
import useBatch from "../../hooks/useBatch";
import jsPDF from "jspdf";

const EnrolledCourseBox = ({ courseId, details }) => {
  let course = useCourses(courseId);
  const courseState = course;
  course = course?.[0];

  let batchDetails = useBatch(courseId, details?.batch);

  // console.log(details);

  if (courseState?.isLoading) {
    return (
      <div className="w-full p-5">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  if (courseState?.error) {
    return (
      <p className="text-[17px] 2xl:text-[20px] text-red-500">
        {courseState?.error || "An error occured, please refresh."}
      </p>
    );
  }

  const handleDownloadInvoice = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc
      .setFontSize(25)
      .setFont("Helvetica")
      .setTextColor("black")
      .text("BRAVE EDUCATION", 15, 20)
      .setFontSize(12)
      .text(
        `Registration: ${moment(details?.registeredOn).format(
          "DD MMMM YYYY [at] hh:mma"
        )}`,
        15,
        30
      )
      .text(`${details?.batch ? "Course" : "Test"}: ${course?.name}`, 15, 40);

    details?.batch
      ? doc
          .text(`Batch: ${batchDetails?.name}`, 15, 46)
          .text(`Routine: ${batchDetails?.schedule}`, 15, 52)
      : doc
          .text(`Date: ${moment(details?.date).format("DD MMMM YYYY")}`, 15, 46)
          .text(`Time: ${details?.time}`, 15, 52);

    doc
      .text(`Name: ${details?.name}`, 15, 62)
      .text(`Phone: ${details?.phone}`, 15, 68)
      .text(`Email: ${details?.email}`, 15, 74)
      .text(`Gender: ${details?.gender}`, 15, 80)
      .setFontSize(14)
      .setTextColor("orangered")
      .setFillColor("yellow")
      .text(`ID: ${details?.uid}`, 15, 90)
      .setFontSize(12)
      .setFillColor("white")
      .setTextColor("black")
      .text(`Price: Tk. ${course?.offerPrice}`, 15, 100)
      .setTextColor("navy")
      .text(`${details?.paid ? "PAID" : "NOT PAID"}`, 15, 106)
      .setTextColor("darkslategray")
      .text(
        `Payment method: ${details?.payment_method?.toUpperCase()}`,
        15,
        112
      )
      .text("Thank you.", 15, 124)
      .setTextColor("red")
      .setFontSize(10)
      .text("Hotline: 01937-805552", 15, 128)
      .setTextColor("darkslateblue")
      .text(
        "Address: House No. 05, 1st floor, Block-C (Main Road), Shahjalal Upashahar Main Road, Sylhet 3100",
        15,
        132
      );
    // Save the PDF
    doc.save(`Invoice_${details?.uid || "BE"}.pdf`);
  };

  return (
    <tr className="even:bg-slate-100 border-b-slate-200 font-[400]">
      <td className="max-w-[230px]">
        <div className="flex flex-col gap-1">
          <span>
            Name: <span className="font-[600]">{details?.name}</span>
          </span>
          <span>
            Phone: <span className="font-[600]">{details?.phone}</span>
          </span>
          <span className="w-full overflow-x-auto flex flex-row gap-1 overflow-y-hidden">
            Email: <span className="font-[600]">{details?.email}</span>
          </span>
          <span>
            Gender: <span className="font-[600]">{details?.gender}</span>
          </span>
        </div>
      </td>
      <td className="max-w-[130px]">
        <span className="mb-1 block">
          Course:{" "}
          {course?.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <span className="font-[600] text-indigo-900">{course?.name}</span>
          )}
        </span>
        {details?.batch ? (
          batchDetails?.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <div className="flex flex-col gap-0 items-start justify-start">
              <span className="mb-1">
                Batch:{" "}
                <span className="font-[600] text-indigo-900">
                  {batchDetails?.name}
                </span>
              </span>
              <span className="mb-1">
                Schedule:{" "}
                <span className="font-[600] text-indigo-900">
                  {batchDetails?.schedule}
                </span>
              </span>
            </div>
          )
        ) : (
          <span className="mb-1 block">
            Schedule:{" "}
            <span className="font-[600] text-indigo-900">{details?.time}</span>,{" "}
            <span className="font-[600] text-indigo-900">
              {moment(details?.date).format("D MMM YYYY")}
            </span>
          </span>
        )}
        <span>
          Registered on:
          <span className="font-[600]">
            {" "}
            {moment(details?.registeredOn).format("hh:mmA[,] DD/MM/y")}
          </span>
        </span>
      </td>
      <td className="w-[150px]">
        <span className="font-[600] text-indigo-900 block mb-1">
          ID: {details?.uid}
        </span>
        <span
          className={`block mb-1 font-[600] ${
            details?.paid ? "text-teal-700" : "text-red-700"
          }`}
        >
          {details?.paid ? "PAID" : "UNPAID"}{" "}
          <span className="block text-[13px] text-blue-700 font-[400]">
            ({details?.payment_method?.toUpperCase()})
          </span>
        </span>
        <button
          onClick={handleDownloadInvoice}
          className="active:scale-95 p-2 rounded-md bg-blue-600 text-white font-[400] text-[13px]"
        >
          Invoice
        </button>
      </td>
    </tr>
  );
};

export default EnrolledCourseBox;
