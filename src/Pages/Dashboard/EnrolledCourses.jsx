import { Link } from "react-router-dom";
import EnrolledCourseBox from "../../Components/EnrolledCourse/EnrolledCourseBox";
import Title from "../../Components/Title";
import { FaArrowLeft } from "react-icons/fa6";
import Header from "../../Components/Header";

const EnrolledCourses = () => {
  const enrolled = JSON.parse(localStorage.getItem("be_enrolled_courses"));
  console.log(enrolled)

  return (
    <>
    <Header/>
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <section className="bg-white rounded-md px-5 py-7 text-slate-800 text-[17px] font-[500] shadow-md w-full max-w-[960px] relative mt-[140px] sm:mt-[100px]">
        <Title>Courses you have enrolled</Title>
        <div className="flex flex-col gap-3">
          {enrolled?.map(course => <>
            <EnrolledCourseBox courseId={course?.course} details={course} />
            <div className="divider my-[0px]"></div>
          </>)}
        </div>
      </section>
    </main>
    </>
  );
};
export default EnrolledCourses;
