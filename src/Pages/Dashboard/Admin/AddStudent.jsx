import { useEffect, useState } from "react";
import Title from "../../../Components/Title";
import useCourses from "../../../hooks/useCourses";
import useSchedule from "../../../hooks/useSchedule";
import moment from "moment";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const AddStudent = () => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //   States
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [batch, setBatch] = useState("");
  const [adding, setAdding] = useState(false);

  const courses = useCourses();
  const schedule = useSchedule(course);

  const [type, setType] = useState(schedule?.type);

  useEffect(() => {
    if (!schedule?.isLoading) {
      setType(schedule?.type);
    }
  }, [schedule]);

  if (courses?.isLoading) {
    return "Loading...";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    if (date === "" && time === "" && !batch) {
      setAdding(false);
      return toast("Please select a batch/schedule.");
    }
    const form = e.target;
    const data = {
      name: form?.name?.value,
      phone: form?.phone?.value,
      email: form?.email?.value,
      gender: form?.gender?.value,
      paid: form?.paid?.value,
      registeredOn: moment().format(),
      course: course,
    };
    if (type === "test") {
      data.date = date;
      data.time = time;
    } else {
      data.batch = parseInt(batch);
    }
    try {
      const response = await axiosSecure.post("register-student", { data, token: localStorage.getItem("be_admin") });
      if (response?.data?.message === "success") {
        setAdding(false);
        Swal.fire({
          title: `UID: ${response?.data?.uid}`,
          text: `${data?.name} has been admitted.`,
          icon: "success",
        }).then(() => {
          queryClient.invalidateQueries(["getRegistrations"]);
          return navigate("/admin/registrations");
        });
      } else {
        setAdding(false);
        return toast.error(
          response?.data?.message || "An error occured, please retry."
        );
      }
    } catch (error) {
      setAdding(false);
      return toast.error(error?.message || "An error occured, please retry.");
    }
  };

  return (
    <section className="text-[17px] 2xl:text-[20px] text-slate-800 w-full">
      <Title>Register a student</Title>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-[500px] mx-auto text-[17px] sm:text-[18px] 2xl:text-[20px]"
      >
        <div className="w-full">
          <label
            htmlFor="course"
            className="text-[15px] text-slate-500 block text-left"
          >
            Course
          </label>
          <select
            name="course"
            className="w-full bg-white p-2 rounded-md text-slate-800 border border-slate-200"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            {courses?.map((course) => (
              <option key={course?._id} value={course?._id}>
                {course?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label
            htmlFor="shift"
            className="text-[15px] text-slate-500 block text-left"
          >
            Shift
          </label>
          {schedule?.isLoading ? (
            "Loading..."
          ) : type === "test" ? (
            <select
              name="shift"
              defaultValue="null"
              className="w-full bg-white p-2 rounded-md text-slate-800 border border-slate-200"
              onChange={(e) => {
                let dateTimeValue = e.target.value;
                setDate(dateTimeValue?.split(",")?.shift());
                setTime(dateTimeValue?.split(",")?.pop());
              }}
            >
              <option value="null" disabled>
                Please select a schedule/batch
              </option>
              {schedule?.batches?.map((batch) =>
                batch?.times?.map((time) => (
                  <option
                    key={time.time}
                    value={`${batch?.date},${time?.time}`}
                  >
                    {moment(batch?.date).format("D MMMM Y")} - {time?.time}
                  </option>
                ))
              )}
            </select>
          ) : (
            <select
              name="shift"
              defaultValue="null"
              className="w-full bg-white p-2 rounded-md text-slate-800 border border-slate-200"
              onChange={(e) => {
                setBatch(e.target.value);
              }}
            >
              <option value="null" disabled>
                Please select a schedule/batch
              </option>
              {schedule?.batches?.map((batch) => (
                <option key={batch.id} value={batch?.id}>
                  {batch?.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="w-full">
          <label
            htmlFor="name"
            className="text-[15px] text-slate-500 block text-left"
          >
            Student&apos;s Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Student's Name"
            required
            className="w-full bg-white p-2 rounded-md text-slate-800 border border-slate-200"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="phone"
            className="text-[15px] text-slate-500 block text-left"
          >
            Student&apos;s Phone
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Student's Phone Number"
            required
            className="w-full bg-white p-2 rounded-md text-slate-800 border border-slate-200"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="email"
            className="text-[15px] text-slate-500 block text-left"
          >
            Student&apos;s email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Student's email"
            className="w-full bg-white p-2 rounded-md text-slate-800 border border-slate-200"
          />
        </div>
        <div>
          <label
            htmlFor="gender"
            className="text-[15px] text-slate-500 font-[400]"
          >
            Gender
          </label>
          <div className="flex flex-row gap-1 items-center">
            <label
              htmlFor="male"
              className="text-[17px] 2xl:text-[20px] text-slate-800"
            >
              Male
            </label>
            <input
              required
              type="radio"
              name="gender"
              id="male"
              value="male"
              className="radio radio-sm radio-primary mr-4"
            />
            <label
              htmlFor="female"
              className="text-[17px] 2xl:text-[20px] text-slate-800"
            >
              Female
            </label>
            <input
              required
              type="radio"
              name="gender"
              id="female"
              value="female"
              className="radio radio-sm radio-primary"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="paid"
            className="text-[15px] text-slate-500 block text-left"
          >
            Paid?
          </label>
          <select
            name="paid"
            className="w-full bg-white p-2 rounded-md text-slate-800 border border-slate-200"
            required
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn bg-indigo-700 text-white text-[16px] mt-5"
          disabled={adding}
        >
          {adding ? "Adding..." : "Admit Student"}
        </button>
      </form>
    </section>
  );
};
export default AddStudent;
