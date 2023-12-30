import { Link, useNavigate } from "react-router-dom";
import EnrolledCourseBox from "../../Components/EnrolledCourse/EnrolledCourseBox";
import Title from "../../Components/Title";
import Header from "../../Components/Header";
import EmptyGif from "../../assets/empty.gif";
import useSettings from "../../hooks/useSettings";
import useEnrolledCourses from "../../hooks/useEnrolledCourses";
import { useState } from "react";
import Login from "../../Components/Auth/Login";
import Register from "../../Components/Auth/Register";
import { Helmet } from "react-helmet";

const EnrolledCourses = () => {
  const { setDetails } = useSettings();
  const checkUser = localStorage.getItem("be_student");
  const navigate = useNavigate();
  const { setCurrentStep } = useSettings();

  const enrolled = useEnrolledCourses(
    JSON.parse(checkUser)?.phone || "000000000"
  );

  const [authState, setAuthState] = useState("login");

  if (checkUser) {
    return (
      <>
        <Helmet>
          <title>Enrolled Courses | Brave Education</title>
        </Helmet>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
          <section className="bg-white rounded-md px-5 py-7 text-slate-800 text-[17px] 2xl:text-[20px] font-[500] shadow-md w-full max-w-[960px] relative mt-[140px] sm:mt-[100px]">
            <Title>Courses you have enrolled</Title>
            <div className="flex flex-col gap-3">
              {enrolled?.isLoading ? (
                "Loading..."
              ) : enrolled?.length > 0 ? (
                <div className="overflow-x-auto my-6">
                  <table className="table text-[17px] 2xl:text-[20px] text-slate-800 font-[500]">
                    {/* head */}
                    <thead>
                      <tr className="text-[17px] 2xl:text-[20px] text-slate-700 font-[600]">
                        <th>Details</th>
                        <th>Course & Schedule</th>
                        <th>UID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolled?.map((course) => (
                        <EnrolledCourseBox
                          key={course?.uid}
                          courseId={course?.course}
                          details={course}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
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
          <button
            onClick={() => {
              localStorage.removeItem("be_student");
              setDetails({});
              return navigate("/");
            }}
            className="btn bg-red-500 text-white block ml-auto mr-2 mb-2 mt-10"
          >
            Logout
          </button>
        </main>
      </>
    );
  } else {
    return authState === "register" ? (
      <Register setAuthState={setAuthState} />
    ) : (
      <Login setAuthState={setAuthState} />
    );
  }
};
export default EnrolledCourses;
