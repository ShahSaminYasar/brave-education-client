import useCourses from "../../hooks/useCourses";
import moment from "moment";

const EnrolledCourseBox = ({ courseId, details }) => {
  let course = useCourses(courseId);
  const courseState = course;
  course = course?.[0];

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

  return (
    <div className="w-full p-3 flex flex-col md:flex-row gap-4 justify-between items-center text-[17px] 2xl:text-[20px] font-[500] text-slate-800">
      <div className="flex flex-col gap-2 md:gap-7 md:flex-row items-center">
        <img
          src={course?.thumbnail}
          alt="Course Thumbnail"
          className="w-[120px] h-[90px] object-cover rounded-md aspect-[16/10]"
        />
        <div className="flex flex-col">
          <span className="text-[20px] font-[600]">{course?.name}</span>
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
          <span
            className={`font-[600] text-[17px] 2xl:text-[20px] ${
              details?.paid ? "text-green-500" : "text-red-500"
            }`}
          >
            {details?.paid ? "PAID" : "UNPAID"}
          </span>
        </div>
      </div>
      <span>
        <span className="text-indigo-700 font-[600]">
          {details?.schedule?.time}
        </span>{" "}
        on{" "}
        <span className="text-indigo-800 font-[600]">
          {moment(details?.schedule?.date).format("D MMMM YYYY")}
        </span>
      </span>
      <span>
        ID:{" "}
        <span className="font-[600] text-indigo-800 text-[20px]">
          {details?.uid}
        </span>
      </span>
    </div>
  );
};

export default EnrolledCourseBox;
