import { Link, useNavigate } from "react-router-dom";
import EnrolledCourseBox from "../../Components/EnrolledCourse/EnrolledCourseBox";
import Title from "../../Components/Title";
import Header from "../../Components/Header";
import EmptyGif from "../../assets/empty.gif";
import useSettings from "../../hooks/useSettings";
import useEnrolledCourses from "../../hooks/useEnrolledCourses";
import BraveFavicon from "../../assets/favicon-brave.jpg";
import { useState } from "react";

const EnrolledCourses = () => {
  const enrolled = useEnrolledCourses("01723799107");

  const [authState, setAuthState] = useState("register");

  const { setCurrentStep } = useSettings();
  const navigate = useNavigate();

  const checkUser = localStorage.getItem("be_student");
  const tempUser = JSON.parse(localStorage.getItem("be_student_temp"));

  const handleLogin = async (e) => {
    e.preventDefault();
  };

  if (localStorage.getItem("be_student")) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
          <section className="bg-white rounded-md px-5 py-7 text-slate-800 text-[17px] 2xl:text-[20px] font-[500] shadow-md w-full max-w-[960px] relative mt-[140px] sm:mt-[100px]">
            <Title>Courses you have enrolled</Title>
            <div className="flex flex-col gap-3">
              {enrolled?.isLoading ? (
                "Loading..."
              ) : enrolled?.length > 0 ? (
                enrolled?.map((course) => (
                  <div key={course?.uid}>
                    <EnrolledCourseBox
                      courseId={course?.course}
                      details={course}
                    />
                    <div className="divider my-[0px]"></div>
                  </div>
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
  } else {
    return authState === "register" ? (
      <section className="bg-white min-h-screen">
        <div className="min-h-[80vh] flex flex-col justify-center items-center gap-[70px] bg-white text-slate-900 text-[20px] font-[400]">
          <Link to="/">
            <img
              src={BraveFavicon}
              alt="Brave Education Logo"
              className="w-[120px] aspect-square rounded-full object-contain"
            />
          </Link>
          <form
            onSubmit={handleLogin}
            className="text-[20px] font-[400] text-slate-900 flex flex-col gap-4 items-start shadow-md p-5 w-full max-w-[400px]"
          >
            <h1 className="text-[25px] text-red-500 block text-left">
              Register
            </h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              defaultValue={tempUser?.name}
              className="w-full outline-none input input-bordered bg-white"
            />
            <input
              type="number"
              name="phone"
              placeholder="Phone"
              disabled={tempUser?.phone}
              defaultValue={tempUser?.phone}
              className="w-full outline-none input input-bordered bg-white disabled:bg-slate-200 disabled:border-none disabled:outline-none disabled:text-slate-700"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={tempUser?.email}
              className="w-full outline-none input input-bordered bg-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full outline-none input input-bordered bg-white"
            />
            <input
              type="password"
              name="repassword"
              placeholder="Confirm Password"
              className="w-full outline-none input input-bordered bg-white"
            />
            <button
              type="submit"
              className="btn bg-red-500 text-[18px] text-white block w-full border-none"
            >
              Login
            </button>
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthState("login")}
                className="text-red-500"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </section>
    ) : (
      <section className="bg-white min-h-screen">
        <div className="min-h-[80vh] flex flex-col justify-center items-center gap-[70px] bg-white text-slate-900 text-[20px] font-[400]">
          <Link to="/">
            <img
              src={BraveFavicon}
              alt="Brave Education Logo"
              className="w-[120px] aspect-square rounded-full object-contain"
            />
          </Link>
          <form
            onSubmit={handleLogin}
            className="text-[20px] font-[400] text-slate-900 flex flex-col gap-4 items-start shadow-md p-5 w-full max-w-[400px]"
          >
            <h1 className="text-[25px] text-red-500 block text-left">
              Login
            </h1>
            <input
              type="number"
              name="phone"
              placeholder="Phone"
              disabled={tempUser?.phone}
              defaultValue={tempUser?.phone}
              className="w-full outline-none input input-bordered bg-white disabled:bg-slate-200 disabled:border-none disabled:outline-none disabled:text-slate-700"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full outline-none input input-bordered bg-white"
            />
            <button
              type="submit"
              className="btn bg-red-500 text-[18px] text-white block w-full border-none"
            >
              Login
            </button>
            <p>
              New user?{" "}
              <button
                type="button"
                onClick={() => setAuthState("register")}
                className="text-red-500"
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </section>
    );
  }
};
export default EnrolledCourses;
