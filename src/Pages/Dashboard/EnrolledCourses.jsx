import { useNavigate } from "react-router-dom";
import EnrolledCourseBox from "../../Components/EnrolledCourse/EnrolledCourseBox";
import Title from "../../Components/Title";
import Header from "../../Components/Header";
import EmptyGif from "../../assets/empty.gif";
import useSettings from "../../hooks/useSettings";

const EnrolledCourses = () => {
  const enrolled = JSON.parse(localStorage.getItem("be_enrolled_courses"));
  const { setCurrentStep } = useSettings();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <section className="bg-white rounded-md px-5 py-7 text-slate-800 text-[17px] 2xl:text-[20px] font-[500] shadow-md w-full max-w-[960px] relative mt-[140px] sm:mt-[100px]">
          <Title>Courses you have enrolled</Title>
          <div className="flex flex-col gap-3">
            {enrolled?.length > 0 ? (
              enrolled?.map((course) => (
                <>
                  <EnrolledCourseBox
                    key={course?.course}
                    courseId={course?.course}
                    details={course}
                  />
                  <div className="divider my-[0px]"></div>
                </>
              ))
            ) : (
              <>
                <img
                  src={EmptyGif}
                  alt="Empty Gif"
                  className="w-[200px] aspect-square rounded-full object-cover block mx-auto"
                />
                <p className="block text-[17px] text-center">
                  You haven&apos;t enrolled in any course/test yet.{" "}
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      return navigate("/");
                    }}
                    className="text-indigo-600"
                  >
                    Enroll now?
                  </button>
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};
export default EnrolledCourses;
