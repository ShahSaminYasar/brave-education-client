import { FaArrowRight } from "react-icons/fa6";
import Title from "../Components/Title";
import useSettings from "../hooks/useSettings";
import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import toast from "react-hot-toast";
import { ScrollRestoration } from "react-router-dom";

const Details = () => {
  const { details, setDetails, prevStep, nextStep } = useSettings();
  const axiosSecure = useAxios();

  const [localStudentData, setLocalStudentData] = useState({});
  const [gender, setGender] = useState(
    localStudentData?.gender ||
      JSON.parse(localStorage.getItem("be_student_temp"))?.gender ||
      ""
  );

  useEffect(() => {
    const local_student_data = localStorage.getItem("be_student");
    if (local_student_data) {
      setLocalStudentData(JSON.parse(local_student_data));
      setGender(JSON.parse(local_student_data)?.gender);
    }
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const data = { name, email, phone, gender };
    setDetails({ ...details, student: data });
    if (!localStudentData?.phone) {
      localStorage.setItem("be_student_temp", JSON.stringify(data));
    }
    // console.log(
    //   data?.name,
    //   details?.schedule?.date,
    //   data?.phone,
    //   details?.course
    // );
    let checkUrl;
    if (details?.batch) {
      checkUrl = `/check-enrolled?name=${data?.name}&batch=${details?.batch}&phone=${data?.phone}&courseId=${details?.course}`;
    } else {
      checkUrl = `/check-enrolled?name=${data?.name}&date=${details?.schedule?.date}&phone=${data?.phone}&courseId=${details?.course}`;
    }
    const check = await axiosSecure.get(checkUrl);
    // console.log(checkUrl, check?.data?.message);
    if (check?.data?.message === "eligible") {
      nextStep();
    } else {
      return toast(
        check?.data?.message || "You already have a schedule on that day."
      );
    }
  };

  return (
    <>
      <ScrollRestoration />
      <section>
        <Title>Your Details</Title>
        <form onSubmit={handleSubmitForm}>
          <div className="w-full max-w-[500px] mx-auto flex flex-col gap-3">
            <div>
              <label
                htmlFor="name"
                className="text-[15px] text-slate-500 font-[400]"
              >
                Name
              </label>
              <input
                required
                name="name"
                type="text"
                defaultValue={
                  localStudentData?.name ||
                  JSON.parse(localStorage.getItem("be_student_temp"))?.name ||
                  ""
                }
                placeholder="Your Full Name"
                className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 focus:border-[#4438caa6]"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-[15px] text-slate-500 font-[400]"
              >
                Email
              </label>
              <input
                name="email"
                type="text"
                defaultValue={
                  localStudentData?.email ||
                  JSON.parse(localStorage.getItem("be_student_temp"))?.email ||
                  ""
                }
                placeholder="Your Email Address"
                className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 focus:border-[#4438caa6]"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="text-[15px] text-slate-500 font-[400]"
              >
                Phone
              </label>
              <input
                required
                name="phone"
                type="number"
                disabled={
                  localStudentData?.phone ||
                  JSON.parse(localStorage.getItem("be_student_temp"))?.phone
                }
                defaultValue={
                  localStudentData?.phone ||
                  JSON.parse(localStorage.getItem("be_student_temp"))?.phone ||
                  ""
                }
                placeholder="Your Active Phone Number"
                className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 focus:border-[#4438caa6]"
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
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
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
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  type="radio"
                  name="gender"
                  id="female"
                  value="female"
                  className="radio radio-sm radio-primary"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="w-full max-w-[700px] flex flex-row justify-between items-center text-[17px] 2xl:text-[20px] font-[400] text-neutral-800 mt-8">
            <button
              type="button"
              className="py-1 px-4 bg-white text-neutral-500 rounded-md border-[2px] border-neutral-300 active:scale-90"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              type="submit"
              className="py-1 px-4 bg-indigo-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next <FaArrowRight className="text-[14px] -mt-[1px]" />
            </button>
          </div>
        </form>
      </section>
    </>
  );
};
export default Details;
