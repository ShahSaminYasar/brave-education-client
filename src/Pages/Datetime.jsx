import Calendar from "react-calendar";
import Title from "../Components/Title";
import { useEffect, useState } from "react";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import useSettings from "../hooks/useSettings";
import { FaArrowRight } from "react-icons/fa6";
import useSchedule from "../hooks/useSchedule";
import { ScrollRestoration } from "react-router-dom";

const Datetime = () => {
  const { details, setDetails, nextStep, prevStep } = useSettings();

  const [dateValue, setDateValue] = useState(
    details?.schedule?.date || moment().format("YYYY-MM-DD")
  );

  const schedule = useSchedule(details?.course, dateValue);
  // console.log(schedule);

  const [scheduleType, setScheduleType] = useState(null);

  useEffect(() => {
    if (!schedule?.isLoading && schedule?.type) {
      if (schedule?.type !== scheduleType) {
        setScheduleType(schedule?.type);
      }
    }
  }, [schedule, scheduleType]);

  const handleSelectTime = (time) => {
    setDetails({ ...details, schedule: { date: dateValue, time } });
  };

  const handleSelectBatch = (batchId, batchSchedule) => {
    sessionStorage.setItem("be_course_schedule", JSON.stringify(batchSchedule));
    setDetails({ ...details, batch: batchId, batchSchedule });
  };

  return (
    <>
      <ScrollRestoration />
      <section>
        <Title>Select a date and time</Title>
        {!scheduleType ? (
          "Loading..."
        ) : scheduleType === "test" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Calendar
              minDate={new Date()}
              value={dateValue}
              onChange={(value) => {
                setDetails({
                  ...details,
                  schedule: { date: moment(value).format("YYYY-MM-DD") },
                });
                setDateValue(moment(value).format("YYYY-MM-DD"));
              }}
            />
            <div>
              {schedule?.isLoading ? (
                <p className="block text-center text-[16px] text-slate-500">
                  Loading...
                </p>
              ) : schedule?.error ? (
                <p className="text-red-500 block text-center text-[16px]">
                  {schedule?.error || "An error occured."}
                </p>
              ) : schedule?.batches?.times?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {schedule?.batches?.times?.map((time) => (
                    <button
                      disabled={time?.enrolled >= 15}
                      key={time?.time}
                      className={`w-full p-2 flex flex-row flex-wrap justify-center items-center border-2 border-indigo-700 rounded-md shadow-md text-[20px] font-[500] disabled:opacity-50 relative ${time?.time === details?.schedule?.time
                        ? "bg-indigo-700 text-slate-200"
                        : "bg-white text-slate-800"
                        }`}
                      onClick={() => handleSelectTime(time?.time)}
                    >
                      {time?.time}{" "}
                      {time?.enrolled >= 15 && (
                        <span className="text-[12px] p-1 rounded-sm bg-slate-700 text-white absolute top-0 right-0 leading-[10px]">
                          Full
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="block text-center text-[16px] text-slate-500">
                  Sorry, there are no shifts on that day.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {schedule?.batches?.map((batch) => {
              return (
                <button
                  disabled={batch?.enrolled >= batch?.capacity}
                  key={batch?.id}
                  className={`h-fit w-full p-2 flex flex-col flex-wrap justify-start items-start border-2 border-indigo-700 rounded-md shadow-md text-[16px] font-[500] disabled:opacity-50 relative gap-1 ${batch?.id === details?.batch
                    ? "bg-indigo-700 text-slate-200"
                    : "bg-white text-slate-800"
                    }`}
                  onClick={() => handleSelectBatch(batch?.id, batch?.schedule)}
                >
                  <span className="text-[20px] block text-center w-full">
                    {batch?.name}
                  </span>
                  <span className="block text-center w-full font-[400]">
                    Duration: {batch?.duration}
                  </span>
                  <div className="px-3 text-left flex flex-col gap-0 w-full mx-auto">
                    <span className="font-[800] block">Routine:</span>
                    {batch?.schedule?.split(",")?.map((schedule) => (
                      <span
                        key={schedule}
                        className={`block text-left w-full ${batch?.id === details?.batch
                          ? "text-white"
                          : "text-indigo-900"
                          }`}
                      >
                        {schedule}
                      </span>
                    ))}
                    {batch?.features && (
                      <>
                        <span className="font-[800] block mt-2">Details:</span>
                        {batch?.features?.split(",")?.map(feature => (
                          <span className={`flex flex-row justify-between items-center gap-2 font-[400] ${batch?.id === details?.batch
                            ? "text-slate-200"
                            : "text-indigo-950"
                            }`}>
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
            disabled={!details?.schedule?.time && !details?.batch}
            onClick={nextStep}
          >
            Next <FaArrowRight className="text-[14px] -mt-[1px]" />
          </button>
        </div>
      </section>
    </>
  );
};
export default Datetime;
