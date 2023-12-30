import { FaCheckDouble } from "react-icons/fa6";
import {
  Link,
  Navigate,
  ScrollRestoration,
  useNavigate,
} from "react-router-dom";
import useSettings from "../hooks/useSettings";
import useCourses from "../hooks/useCourses";
import moment from "moment";
import { IoLocationOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import PaymentFailedGif from "../assets/payment_failed.gif";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import useBatch from "../hooks/useBatch";

const Checkout = () => {
  const navigate = useNavigate();
  const { details, setDetails, setCurrentStep } = useSettings();

  const query = new URLSearchParams(window.location.search);
  const status = query.get("status");
  const uid = details?.uid || query.get("uid");
  const paid = Boolean(details?.paid) || Boolean(query.get("paid"));
  const payment_method = details?.payment_method || query.get("method");

  const [loading, setLoading] = useState(true);
  const [registrationDetails, setRegistrationDetails] = useState(null);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      if (details.uid) {
        // console.log("RD set from state");
        // console.log(details)
        setRegistrationDetails(details);
        setLoading(false);
      } else if (JSON.parse(sessionStorage.getItem("be_details_temp"))) {
        // console.log("RD set from SS");
        const tempDetails = JSON.parse(
          sessionStorage.getItem("be_details_temp")
        );
        setRegistrationDetails({
          ...tempDetails,
          paid,
          uid,
        });
        setDetails({
          ...tempDetails,
          paid,
          uid,
        });
        sessionStorage.removeItem("be_details_temp");
        // console.log("Operation DOne");
        setLoading(false);
      } else {
        // console.log("No RD");
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [details, paid, uid, setDetails]);

  const enrolledCourses = JSON.parse(
    localStorage.getItem("be_enrolled_courses")
  );

  useEffect(() => {
    if (uid && registrationDetails) {
      const check = enrolledCourses?.some(
        (enrolledCourse) => enrolledCourse?.uid === uid
      );

      if (!check) {
        const newEnrolledArray = enrolledCourses
          ? [...enrolledCourses, registrationDetails]
          : [registrationDetails];

        localStorage.setItem(
          "be_enrolled_courses",
          JSON.stringify(newEnrolledArray)
        );
      }
    }
  }, [uid, enrolledCourses, registrationDetails]);

  const courseDetails = useCourses(registrationDetails?.course);
  const batchDetails = useBatch(
    registrationDetails?.course || "000000000000000000000000",
    registrationDetails?.batch || "00000"
  );

  if (!loading && !registrationDetails && status === "successful") {
    return <Navigate to="/" />;
  }

  const handleRestart = () => {
    setDetails({});
    setCurrentStep(1);
    return navigate("/");
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc
      .setFontSize(25)
      .setFont("Helvetica")
      .setTextColor("black")
      .text("BRAVE EDUCATION", 15, 20)
      .setFontSize(12)
      .text(
        `Registration: ${moment(registrationDetails?.registeredOn).format(
          "DD MMMM YYYY [at] hh:mma"
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
      );

    registrationDetails?.batch
      ? doc
          .text(`Batch: ${batchDetails?.name}`, 15, 46)
          .text(`Routine: ${batchDetails?.schedule}`, 15, 52)
      : doc
          .text(
            `Date: ${moment(registrationDetails?.schedule?.date).format(
              "DD MMMM YYYY"
            )}`,
            15,
            46
          )
          .text(`Time: ${registrationDetails?.schedule?.time}`, 15, 52);

    doc
      .text(`Name: ${registrationDetails?.student?.name}`, 15, 62)
      .text(`Phone: ${registrationDetails?.student?.phone}`, 15, 68)
      .text(`Email: ${registrationDetails?.student?.email}`, 15, 74)
      .text(`Gender: ${registrationDetails?.student?.gender}`, 15, 80)
      .setFontSize(14)
      .setTextColor("orangered")
      .setFillColor("yellow")
      .text(`ID: ${registrationDetails?.uid}`, 15, 90)
      .setFontSize(12)
      .setFillColor("white")
      .setTextColor("black")
      .text(`Price: Tk. ${courseDetails?.[0]?.offerPrice}`, 15, 100)
      .setTextColor("navy")
      .text(`${registrationDetails?.paid ? "PAID" : "NOT PAID"}`, 15, 106)
      .setTextColor("darkslategray")
      .text(`Payment method: ${registrationDetails?.payment_method?.toUpperCase()}`, 15, 112)
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
    doc.save(`Invoice_${registrationDetails?.uid || "BE"}.pdf`);
  };

  return (
    <>
      <ScrollRestoration />
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <section className="bg-white rounded-md px-5 py-7 text-slate-800 text-[17px] 2xl:text-[20px] font-[500] shadow-md w-full max-w-[660px] relative">
          {status !== "successful" ? (
            <>
              <div className="flex flex-col gap-2 items-center text-[23px] text-center text-red-600 font-[500]">
                <img
                  src={PaymentFailedGif}
                  alt="Payment Failed GIF"
                  className="w-[200px] aspect-square rounded-full object-cover shadow-md"
                />
                <span>Payment {status}</span>
              </div>
              <Link
                to="/"
                className="block mt-4 mx-auto w-fit py-2 px-3 border-2 border-indigo-700 rounded-md text-indigo-700"
              >
                Retry?
              </Link>
            </>
          ) : (
            <>
              <div className="py-4 px-2">
                {courseDetails?.isLoading ? (
                  <span className="loader loader-spinner loader-sm"></span>
                ) : courseDetails?.error ? (
                  <p className="block text-red-500 text-center mb-4">
                    {courseDetails?.error || "An error occured, please retry."}
                  </p>
                ) : (
                  <>
                    <FaCheckDouble className="text-[70px] text-green-500 block mx-auto mb-5" />
                    <p className="text-[20px] text-slate-800 font-[500] block text-center mb-2">
                      You have successfully registered in the course <br />
                      <span className="font-[600]">
                        {courseDetails?.[0]?.name}
                      </span>
                    </p>
                    <p className="block text-center mb-2">
                      Your ID:{" "}
                      <span className="font-[600] text-[22px] text-indigo-800">
                        {uid}
                      </span>
                      <span className="text-[12px] text-slate-600 font-[300] italic -mt-[6px] block">
                        (Please save it for future use)
                      </span>
                    </p>
                    <div className="flex flex-col gap-2 justify-start items-start">
                      {registrationDetails?.schedule ? (
                        <p className="block text-center w-full">
                          We expect your presence at{" "}
                          <span className="text-indigo-700 font-[600]">
                            {registrationDetails?.schedule?.time}
                          </span>{" "}
                          on{" "}
                          <span className="text-indigo-800 font-[600]">
                            {moment(registrationDetails?.schedule?.date).format(
                              "D MMMM YYYY"
                            )}
                          </span>
                        </p>
                      ) : (
                        <p className="block text-center w-full bg-slate-50 rounded-md p-2 shadow-sm border-2 border-white text-indigo-700">
                          Routine: {registrationDetails?.batchSchedule}
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center my-3 text-[15px] text-slate-700">
                        <div className="grid grid-cols-6 sm:col-span-2 items-center border-[1px] border-slate-200 p-2">
                          <div className="grid col-span-1 justify-center">
                            <IoLocationOutline className="text-[30px]" />
                          </div>
                          <div className="col-span-5 text-center">
                            House No. 05, 1st floor, Block-C (Main Road),
                            Shahjalal Upashahar Main Road, Sylhet 3100
                          </div>
                        </div>
                        <div className="h-full grid grid-cols-6 sm:col-span-1 items-center border-[1px] border-slate-200 p-2">
                          <div className="grid col-span-1 justify-center">
                            <IoCallOutline className="text-[30px]" />
                          </div>
                          <div className="col-span-5 text-center">
                            01937-805552
                          </div>
                        </div>
                      </div>
                      {/* <div className="divider my-[0px]"></div> */}
                      <div className="grid sm:flex sm:flex-row gap-2 sm:gap-3 items-center justify-center w-full mt-5 text-center">
                        <button
                          onClick={handleDownloadInvoice}
                          className="rounded-md py-2 px-3 text-[16px] bg-rose-600 text-white font-[400] active:scale-95 shadow-lg active:shadow-none"
                        >
                          Download Invoice
                        </button>
                        <button
                          onClick={handleRestart}
                          className="rounded-md py-2 px-3 text-[16px] bg-indigo-600 text-white font-[400] active:scale-95 shadow-lg active:shadow-none"
                        >
                          Register another course
                        </button>
                        <Link
                          to="/enrolled-courses"
                          className="rounded-md py-2 px-3 text-[16px] bg-emerald-600 text-white font-[400] active:scale-95 shadow-lg active:shadow-none"
                        >
                          Account
                        </Link>
                      </div>
                    </div>
                    <span
                      className={`absolute -top-[5px] -right-[5px] text-[30px] font-[700] text-white ${
                        registrationDetails?.paid
                          ? "bg-teal-900"
                          : "bg-rose-900"
                      } rounded-md px-2 leading-[40px] ${
                        courseDetails?.[0]?.offerPrice === 0 ? "hidden" : ""
                      }`}
                    >
                      {registrationDetails?.paid ? "PAID" : "UNPAID"}
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
};
export default Checkout;
