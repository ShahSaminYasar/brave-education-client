import { FaArrowRight } from "react-icons/fa6";
import useSettings from "../hooks/useSettings";
import Title from "../Components/Title";
import useCourses from "../hooks/useCourses";
import moment from "moment";
import { ScrollRestoration } from "react-router-dom";

const Cart = () => {
  const { details, prevStep, nextStep } = useSettings();

  const courseDetails = useCourses(details?.course);

  return (
    <>
      <ScrollRestoration />
      <section>
        <Title>Cart</Title>
        {courseDetails?.isLoading ? (
          <p className="block text-center text-[16px] text-slate-500">
            Loading...
          </p>
        ) : courseDetails?.error ? (
          <p className="block text-center text-[16px] text-red-500">
            {courseDetails?.error ||
              courseDetails?.error?.message ||
              "An error occured, please try again."}
          </p>
        ) : (
          <div className="flex flex-col-reverse gap-5 sm:gap-1 sm:flex-row justify-between items-start text-[15px] sm:text-[17px] 2xl:text-[20px] font-[500] w-full text-slate-800">
            <div className="flex flex-col gap-2 justify-start items-start">
              <h3
                className={`text-indigo-700 text-[25px] sm:text-[28px] font-[500]`}
              >
                {courseDetails?.[0]?.name}
              </h3>
              {details?.batchStartDate && (
                <span>
                  Batch starts from{" "}
                  <span className="font-[800]">{details?.batchStartDate}</span>
                </span>
              )}
              <span>
                Duration:{" "}
                {courseDetails?.[0]?.duration >= 525600 // 365 days in minutes
                  ? `${Math.floor(
                      courseDetails?.[0]?.duration / 525600
                    )} Years ` +
                    (courseDetails?.[0]?.duration % 525600 >= 43200 // 30 days in minutes
                      ? `${Math.floor(
                          (courseDetails?.[0]?.duration % 525600) / 43200
                        )} Months `
                      : "")
                  : courseDetails?.[0]?.duration >= 43200 // 30 days in minutes
                  ? `${Math.floor(
                      courseDetails?.[0]?.duration / 43200
                    )} Months `
                  : courseDetails?.[0]?.duration >= 1440
                  ? `${Math.floor(courseDetails?.[0]?.duration / 1440)} Days ` +
                    (courseDetails?.[0]?.duration % 1440 >= 60
                      ? `${Math.floor(
                          (courseDetails?.[0]?.duration % 1440) / 60
                        )} Hours `
                      : "") +
                    (courseDetails?.[0]?.duration % 60 === 0
                      ? ""
                      : `${courseDetails?.[0]?.duration % 60} Minutes`)
                  : courseDetails?.[0]?.duration >= 60
                  ? `${Math.floor(courseDetails?.[0]?.duration / 60)} Hours ` +
                    (courseDetails?.[0]?.duration % 60 === 0
                      ? ""
                      : `${courseDetails?.[0]?.duration % 60} Minutes`)
                  : `${courseDetails?.[0]?.duration} Minutes`}
              </span>
              {courseDetails?.[0]?.type === "test" ? (
                <span>
                  Schedule:{" "}
                  <span className="text-indigo-700 font-[600]">
                    {moment(details?.schedule?.date).format("D MMMM YYYY")}
                  </span>{" "}
                  at{" "}
                  <span className="text-indigo-700 font-[600]">
                    {details?.schedule?.time}
                  </span>
                </span>
              ) : (
                "Routine: " + details?.batchSchedule
              )}
              <div className="divider my-[0px]"></div>
              <span>
                Name:{" "}
                <span className="font-[600]">{details?.student?.name}</span>
              </span>
              <span>
                Phone:{" "}
                <span className="font-[600]">{details?.student?.phone}</span>
              </span>
              <span>
                Email:{" "}
                <span className="font-[600]">{details?.student?.email}</span>
              </span>
              <div className="divider my-0"></div>
              <span>
                {courseDetails?.[0]?.price === 0 ? (
                  <span className="text-[20px] text-green-500 font-[500]">
                    FREE
                  </span>
                ) : (
                  <span>
                    Price:{" "}
                    <span className="font-[600]">
                      Tk. {courseDetails?.[0]?.offerPrice}
                    </span>
                  </span>
                )}
              </span>
            </div>
            <img
              src={courseDetails?.[0]?.thumbnail}
              alt="Course Thumbnail"
              className="w-full max-w-[220px] block mx-auto sm:mx-0 sm:max-w-[200px] aspect-[16/12] object-cover rounded-md"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="w-full max-w-[700px] flex flex-row justify-between items-center text-[17px] 2xl:text-[20px] font-[400] text-neutral-800 mt-6">
          <button
            className="py-1 px-4 bg-white text-neutral-500 rounded-md border-[2px] border-neutral-300 active:scale-90"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            className="py-1 px-4 bg-indigo-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
            onClick={nextStep}
          >
            Next <FaArrowRight className="text-[14px] -mt-[1px]" />
          </button>
        </div>
      </section>
    </>
  );
};
export default Cart;
