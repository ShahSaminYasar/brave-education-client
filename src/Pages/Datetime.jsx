import Calendar from "react-calendar";
import Title from "../Components/Title";
import { useEffect, useState } from "react";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import useSettings from "../hooks/useSettings";
import { FaArrowRight } from "react-icons/fa6";
import useSchedule from "../hooks/useSchedule";
import { ScrollRestoration } from "react-router-dom";
import useCourses from "../hooks/useCourses";

const Datetime = () => {
  const { details, setDetails, nextStep, prevStep } = useSettings();

  const [dateValue, setDateValue] = useState(
    details?.schedule?.date || moment().format("YYYY-MM-DD")
  );
  const [speakingTestOpen, setSpeakingTestOpen] = useState(false);
  const [selectedMockDate, setSelectedMockDate] = useState(null);

  let schedule = useSchedule(details?.course);
  const scheduleState = schedule;
  let schedule_type = schedule?.type;
  schedule = schedule?.batches;
  // console.log(schedule);

  let course = useCourses(details?.course);
  course = course?.[0];

  const [scheduleType, setScheduleType] = useState(null);

  useEffect(() => {
    if (!schedule?.isLoading && schedule_type) {
      if (schedule_type !== scheduleType) {
        setScheduleType(schedule_type);
      }
    }
  }, [schedule, scheduleType]);

  const handleSelectTime = (date, time) => {
    setSelectedMockDate(date);
    setDetails({ ...details, schedule: { date: date, time } });
  };

  const handleSelectSpeakingTime = (date, time) => {
    setDetails({ ...details, speakingSchedule: { date: date, time } });
  };

  const handleSelectBatch = (batchId, batchSchedule, batchStartDate) => {
    sessionStorage.setItem("be_course_schedule", JSON.stringify(batchSchedule));
    setDetails({ ...details, batch: batchId, batchSchedule, batchStartDate });
  };

  return (
    <>
      <ScrollRestoration />
      <section>
        <Title>Select a date and time</Title>
        {!speakingTestOpen ? (
          !scheduleType || course?.isLoading ? (
            "Loading..."
          ) : scheduleType === "test" ? (
            <div className="flex justify-center">
              <div>
                {scheduleState?.isLoading ? (
                  <p className="block text-center text-[16px] text-slate-500">
                    Loading...
                  </p>
                ) : scheduleState?.error ? (
                  <p className="text-red-500 block text-center text-[16px]">
                    {scheduleState?.error || "An error occured."}
                  </p>
                ) : schedule?.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-5 items-center justify-center">
                    {schedule?.map((date) =>
                      date?.times?.map((time) => (
                        <button
                          disabled={time?.enrolled >= 15}
                          key={time?.time}
                          className={`w-full p-2 flex-row flex-wrap justify-center items-center border-2 border-indigo-700 rounded-md shadow-md text-[20px] font-[500] disabled:opacity-50 relative ${
                            date?.date <= moment().format("YYYY-MM-DD")
                              ? "hidden"
                              : "flex"
                          } ${
                            time?.time === details?.schedule?.time &&
                            date?.date === details?.schedule?.date
                              ? "bg-indigo-700 text-slate-200"
                              : "bg-white text-slate-800"
                          }`}
                          onClick={() =>
                            handleSelectTime(date?.date, time?.time)
                          }
                        >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span
                              className={`font-[800] ${
                                time?.time === details?.schedule?.time &&
                                date?.date === details?.schedule?.date
                                  ? "text-white"
                                  : "text-indigo-900"
                              }`}
                            >
                              {moment(date?.date).format("DD MMM YYYY")}
                            </span>
                            {time?.time}
                          </div>
                          {time?.enrolled >= 15 && (
                            <span className="text-[12px] p-1 rounded-sm bg-slate-700 text-white absolute top-0 right-0 leading-[10px]">
                              Full
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="block text-center text-[16px] text-slate-500">
                    Sorry, there are no shifts available yet.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {schedule?.map((batch) => {
                return (
                  <button
                    disabled={batch?.enrolled >= batch?.capacity}
                    key={batch?.id}
                    className={`h-fit w-full p-2 flex flex-col flex-wrap justify-start items-start border-2 border-indigo-700 rounded-md shadow-md text-[16px] font-[500] disabled:opacity-50 relative gap-1 ${
                      batch?.id === details?.batch
                        ? "bg-indigo-700 text-slate-200"
                        : "bg-white text-slate-800"
                    }`}
                    onClick={() =>
                      handleSelectBatch(
                        batch?.id,
                        batch?.schedule,
                        batch?.duration
                      )
                    }
                  >
                    <span className="text-[20px] block text-center w-full">
                      {batch?.name}
                    </span>
                    <span
                      className={`block text-center font-[400] text-[17px] text-white rounded-md px-2 w-fit mx-auto my-2 ${
                        batch?.id === details?.batch
                          ? "bg-red-600"
                          : "bg-indigo-600"
                      }`}
                    >
                      {batch?.duration}
                    </span>
                    <div className="px-3 text-left flex flex-col gap-0 w-full mx-auto">
                      <span className="font-[800] block">Routine:</span>
                      {batch?.schedule?.split(",")?.map((schedule) => (
                        <span
                          key={schedule}
                          className={`block text-left w-full ${
                            batch?.id === details?.batch
                              ? "text-white"
                              : "text-indigo-900"
                          }`}
                        >
                          {schedule}
                        </span>
                      ))}
                      {batch?.features && (
                        <>
                          <span className="font-[800] block mt-2">
                            Details:
                          </span>
                          {batch?.features?.split(",")?.map((feature) => (
                            <span
                              key={feature}
                              className={`flex flex-row justify-between items-center gap-2 font-[400] ${
                                batch?.id === details?.batch
                                  ? "text-slate-200"
                                  : "text-indigo-950"
                              }`}
                            >
                              <span>{feature?.split("=")?.shift()}: </span>
                              <span>{feature?.split("=")?.pop()}</span>
                            </span>
                          ))}
                        </>
                      )}
                    </div>{" "}
                    {batch?.enrolled >= batch?.capacity && (
                      <span className="text-[12px] p-1 rounded-sm bg-slate-700 text-white absolute top-0 right-0 leading-[10px]">
                        Full
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <>
            <span className="text-center text-[20px] text-indigo-500 font-[600] block p-2 border-2 border-indigo-500">
              Mock test date:{" "}
              {moment(details?.schedule?.date).format("D MMMM YYYY")}
            </span>
            <span className="mt-4 text-left text-[27px] text-slate-800 font-[500] block">
              Select speaking test date and time
            </span>
            {course?.speakingSchedule
              ?.filter(
                (schedule) => schedule?.mockDate === details?.schedule?.date
              )
              ?.map((data) => (
                <div key={data?.speakingDate} className="w-full block mb-7">
                  <span className="text-[20px] mt-4 w-fit py-1 px-2 bg-slate-900 text-white font-[500] block text-left">
                    {data?.speakingDate}
                  </span>
                  <div className="flex flex-row gap-2 flex-wrap mt-2 mb-5">
                    {data?.times?.map((time) => (
                      <button
                        disabled={time?.enrolled >= 2}
                        key={time?.time}
                        className={`w-fit p-2 flex-row flex-wrap justify-center items-center border-2 border-indigo-700 rounded-md shadow-md text-[20px] font-[500] disabled:opacity-50 relative ${
                          data?.speakingDate <= moment().format("YYYY-MM-DD")
                            ? "hidden"
                            : "flex"
                        } ${
                          time?.time === details?.speakingSchedule?.time &&
                          data?.speakingDate === details?.speakingSchedule?.date
                            ? "bg-indigo-700 text-slate-200"
                            : "bg-white text-slate-800"
                        }`}
                        onClick={() =>
                          handleSelectSpeakingTime(
                            data?.speakingDate,
                            time?.time
                          )
                        }
                      >
                        <div className="flex flex-col items-center justify-center gap-1">
                          {time?.time}
                        </div>
                        {time?.enrolled >= 2 && (
                          <span className="text-[12px] p-1 rounded-sm bg-slate-700 text-white absolute top-0 right-0 leading-[10px]">
                            Full
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </>
        )}

        {/* Navigation */}
        <div className="w-full max-w-[700px] flex flex-row justify-between items-center text-[17px] 2xl:text-[20px] font-[400] text-neutral-800 mt-6">
          <button
            className="py-1 px-4 bg-white text-neutral-500 rounded-md border-[2px] border-neutral-300 active:scale-90"
            onClick={prevStep}
          >
            Back
          </button>
          {course?.name === "IELTS Mock Test" ? (
            speakingTestOpen ? (
              <button
                className="py-1 px-4 bg-blue-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
                disabled={
                  !details?.speakingSchedule?.time ||
                  !details?.speakingSchedule?.date
                }
                onClick={nextStep}
              >
                Next <FaArrowRight className="text-[14px] -mt-[1px]" />
              </button>
            ) : (
              <button
                className="py-1 px-4 bg-rose-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
                disabled={!details?.schedule?.time && !details?.batch}
                onClick={() => setSpeakingTestOpen(true)}
              >
                Next <FaArrowRight className="text-[14px] -mt-[1px]" />
              </button>
            )
          ) : (
            <button
              className="py-1 px-4 bg-indigo-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
              disabled={!details?.schedule?.time && !details?.batch}
              onClick={nextStep}
            >
              Next <FaArrowRight className="text-[14px] -mt-[1px]" />
            </button>
          )}
        </div>
      </section>
    </>
  );
};
export default Datetime;
