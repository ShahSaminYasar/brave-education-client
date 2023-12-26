import { useEffect, useState } from "react";
import useSettings from "../hooks/useSettings";
import Title from "../Components/Title";
import useCourses from "../hooks/useCourses";
import { FaArrowRight } from "react-icons/fa6";
import { ScrollRestoration } from "react-router-dom";

const Courses = () => {
  const { nextStep, details, setDetails, setCurrentStep } = useSettings();
  const modules = useCourses();
  let courses;
  let tests;

  const query = new URLSearchParams(window.location.search);
  const redirectCourseId = query.get("c");


  const [selectedCourse, setSelectedCourse] = useState(details?.course);

  useEffect(() => {
    setDetails(null);
  }, [setDetails]);

  const handleNext = () => {
    setDetails({ course: selectedCourse });
    nextStep();
  };

  useEffect(() => {
    if (!modules?.isLoading && redirectCourseId && !selectedCourse) {
      let check = modules.find(module => module._id === redirectCourseId);
      if (check) {
        setDetails({ course: redirectCourseId })
        setCurrentStep(2)
      }
    }
  }, [modules, selectedCourse, redirectCourseId])

  if (modules?.isLoading)
    return (
      <p className="block text-center text-[16px] text-slate-500">Loading...</p>
    );

  if (modules?.error)
    return (
      <p className="block text-center text-[16px] text-red-500">
        {modules?.error}
      </p>
    );

  if (modules?.length === 0)
    return (
      <p className="block text-center text-[16px] text-slate-500">
        Sorry, there are no courses available right now.
      </p>
    );

  courses = modules?.filter(module => module?.type === "course");
  tests = modules?.filter(module => module?.type === "test");

  return (
    <>
      <ScrollRestoration />
      <Title>Select a course</Title>
      <section className="flex flex-col gap-5">
        <h4 className="text-[18px] 2xl:text-[20px] text-slate-900 font-[400] -mb-[10px]">Tests</h4>
        {tests?.map((test) => (
          <div
            key={test?._id}
            style={{
              background:
                "linear-gradient(90deg, rgba(233,77,78,1) 0%, rgba(45,34,168,1) 71%)",
              padding: "2px",
            }}
            className="rounded-md overflow-hidden"
          >
            <button
              className={`w-full flex flex-row items-center gap-3 rounded-md overflow-hidden ${test?._id === selectedCourse
                ? "bg-indigo-700 text-slate-200"
                : "bg-[#fffdfe] text-slate-500"
                } overflow-hidden shadow-sm`}
              onClick={() => setSelectedCourse(test?._id)}
            >
              <img
                src={test?.thumbnail}
                alt="Course Thumbnail"
                className="w-full max-w-[150px] aspect-[16/12] object-cover"
              />
              <div className="flex flex-col justify-center items-start text-[14px] sm:text-[15px] font-[400] w-full">
                <h3
                  className={`${test?._id === selectedCourse
                    ? "text-slate-200"
                    : "text-indigo-700"
                    } text-[20px] sm:text-[25px] font-[500] text-left`}
                >
                  {test?.name}
                </h3>
                <span>
                  Duration:{" "}
                  {test?.duration >= 60
                    ? parseInt(test?.duration / 60) +
                    "H " +
                    (test?.duration % 60 === 0
                      ? ""
                      : (test?.duration % 60) + "M")
                    : test?.duration + "M"}
                </span>
                <span>
                  {test?.offerPrice < test?.price ? (
                    test?.offerPrice === 0 ? (
                      <>
                        <del className="opacity-50 mr-1">
                          Tk. {test?.price}
                        </del>
                        <span className="text-[17px] 2xl:text-[20px] sm:text-[20px] text-green-500 font-[500]">
                          FREE
                        </span>
                      </>
                    ) : (
                      <>
                        <del className="opacity-50 mr-1">
                          Tk. {test?.price}
                        </del>
                        <span className="text-[17px] 2xl:text-[20px] sm:text-[20px] text-green-500 font-[500]">
                          Tk. {test?.offerPrice}
                        </span>
                      </>
                    )
                  ) : test?.price === 0 ? (
                    <span className="text-[17px] 2xl:text-[20px] sm:text-[20px] text-green-500 font-[500]">
                      FREE
                    </span>
                  ) : (
                    "Tk. " + test?.price
                  )}
                </span>
              </div>
            </button>
          </div>
        ))}

        <h4 className="text-[18px] 2xl:text-[20px] text-slate-900 font-[400] -mb-[10px]">Courses</h4>
        {courses?.map((course) => (
          <div
            key={course?._id}
            style={{
              background:
                "linear-gradient(90deg, rgba(233,77,78,1) 0%, rgba(45,34,168,1) 71%)",
              padding: "2px",
            }}
            className="rounded-md overflow-hidden"
          >
            <button
              className={`w-full flex flex-row items-center gap-3 rounded-md overflow-hidden ${course?._id === selectedCourse
                ? "bg-indigo-700 text-slate-200"
                : "bg-[#fffdfe] text-slate-500"
                } overflow-hidden shadow-sm`}
              onClick={() => setSelectedCourse(course?._id)}
            >
              <img
                src={course?.thumbnail}
                alt="Course Thumbnail"
                className="w-full max-w-[150px] aspect-[16/12] object-cover"
              />
              <div className="flex flex-col justify-center items-start text-[14px] sm:text-[15px] font-[400] w-full">
                <h3
                  className={`${course?._id === selectedCourse
                    ? "text-slate-200"
                    : "text-indigo-700"
                    } text-[20px] sm:text-[25px] font-[500] text-left`}
                >
                  {course?.name}
                </h3>
                <span>
                  Duration:{" "}
                  {course?.duration >= 60
                    ? parseInt(course?.duration / 60) +
                    "H " +
                    (course?.duration % 60 === 0
                      ? ""
                      : (course?.duration % 60) + "M")
                    : course?.duration + "M"}
                </span>
                <span>
                  {course?.offerPrice < course?.price ? (
                    course?.offerPrice === 0 ? (
                      <>
                        <del className="opacity-50 mr-1">
                          Tk. {course?.price}
                        </del>
                        <span className="text-[17px] 2xl:text-[20px] sm:text-[20px] text-green-500 font-[500]">
                          FREE
                        </span>
                      </>
                    ) : (
                      <>
                        <del className="opacity-50 mr-1">
                          Tk. {course?.price}
                        </del>
                        <span className="text-[17px] 2xl:text-[20px] sm:text-[20px] text-green-500 font-[500]">
                          Tk. {course?.offerPrice}
                        </span>
                      </>
                    )
                  ) : course?.price === 0 ? (
                    <span className="text-[17px] 2xl:text-[20px] sm:text-[20px] text-green-500 font-[500]">
                      FREE
                    </span>
                  ) : (
                    "Tk. " + course?.price
                  )}
                </span>
              </div>
            </button>
          </div>
        ))}

        {/* Navigation */}
        <div className="w-full max-w-[700px] flex flex-row justify-end items-center text-[17px] 2xl:text-[20px] font-[400] text-neutral-800 mt-6">
          <button
            className="py-1 px-4 bg-indigo-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
            disabled={!selectedCourse}
            onClick={handleNext}
          >
            Next <FaArrowRight className="text-[14px] -mt-[1px]" />
          </button>
        </div>
      </section>
    </>
  );
};
export default Courses;
