import { Link } from "react-router-dom";
import Title from "../../../Components/Title";
import useCourses from "../../../hooks/useCourses";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AdminCourses = () => {
  const courses = useCourses(null, true);
  const axios = useAxios();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("be_admin")

  const handleSetActiveStatus = async (courseId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `The course will become ${status ? "inactive" : "active"}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put("/courses", { courseId, courseStatus: status, token })
          .then((res) => {
            if (res?.data?.message === "success") {
              queryClient.invalidateQueries(["getCourses"]);
            } else {
              toast.error(
                res?.data?.message ||
                  "Couldn't update status, please try again."
              );
            }
          })
          .catch((error) => {
            toast.error(error?.message || "Network Error");
            console.log(error);
          });
      }
    });
  };

  return (
    <section className="text-[17px] 2xl:text-[20px] text-slate-800 w-full">
      <div className="flex flex-row flex-wrap justify-between items-center w-full mb-3">
        <Title>Courses</Title>
      </div>
      {courses?.isLoading ? (
        <div className="flex flex-row p-5 justify-center text-indigo-600 text-[20px]"></div>
      ) : (
        <div className="flex flex-row gap-4 flex-wrap justify-center">
          {courses?.map((course) => (
            <div
              key={course?._id}
              className="w-full max-w-[300px] rounded-md bg-indigo-50 shadow-sm overflow-hidden border-[1px] border-indigo-200"
            >
              <img
                src={course?.thumbnail}
                alt="Course Thumbnail"
                className="w-full aspect-[16/10]"
              />
              <div className="p-3 text-slate-800 text-[17px] sm:text-[18px] 2xl:text-[20px] font-[500] flex flex-col gap-2">
                <h3 className="text-indigo-900 font-[600] text-[21px] md:text-[23px] 2xl:text-[25px]">
                  {course?.name}
                </h3>
                <span
                  className={`text-[13px] font-[500] block w-fit rounded-md py-[2px] px-2 ${
                    course?.active
                      ? "bg-green-200 text-green-500"
                      : "bg-rose-200 text-rose-500"
                  }`}
                >
                  {course?.active ? "Active" : "Inactive"}
                </span>
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
                <div className="grid grid-cols-2 gap-2 w-full items-center mt-3 font-[300] text-[16px]">
                  <Link
                    to={`/admin/edit-course/${course?._id}`}
                    className="py-1 px-2 bg-indigo-700 text-white rounded-md w-full text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      handleSetActiveStatus(course?._id, course?.active)
                    }
                    className={`py-1 px-2 ${
                      course?.active ? "bg-red-700" : "bg-teal-500"
                    } text-white rounded-md w-full text-center bg-opacity-70 hover:bg-opacity-100`}
                  >
                    {course?.active ? "Set Inactive" : "Set Active"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default AdminCourses;
