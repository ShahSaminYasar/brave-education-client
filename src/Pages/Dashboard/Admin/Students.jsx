import { useRef, useState } from "react";
import Title from "../../../Components/Title";
import useStudents from "../../../hooks/useStudents";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

const Students = () => {
  const [findBy, setFindBy] = useState();
  const students = useStudents(findBy);
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const newPasswordRef = useRef(null);

  const [changePasswordStudent, setChangePasswordStudent] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const { phone, password } = form;

    axiosSecure
      .put("/student-change-password", {
        phone: phone?.defaultValue,
        newPassword: password?.value,
        token: localStorage.getItem("be_admin"),
      })
      .then((res) => {
        if (res?.data?.message === "success") {
          queryClient.invalidateQueries("getStudents");
          return toast.success(
            `${changePasswordStudent?.name}'s password was changed`
          );
        } else if (res?.data?.message === "not-modified") {
          return toast("Password was not modified");
        } else {
          return toast.error(res?.data?.message || "Failed, please retry");
        }
      })
      .catch((error) => {
        console.error(error);
        return toast.error(error?.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>Students | Brave Education</title>
      </Helmet>
      <section className="text-[17px] 2xl:text-[20px] text-slate-800 w-full">
        <Title>Registered Students</Title>
        <div className="flex flex-row justify-end mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFindBy(e.target.findBy.value);
            }}
            className="flex flex-row gap-[0px] w-fit border-2 border-rose-600 rounded-md overflow-hidden"
          >
            <input
              type="text"
              name="findBy"
              placeholder="Phone Number"
              className="bg-white text-slate-900 py-2 px-3 outline-none"
            />
            <button
              type="submit"
              className="py-2 px-3 bg-rose-600 text-slate-100"
            >
              Find
            </button>
          </form>
        </div>
        <div>
          {students?.isLoading ? (
            "Loading..."
          ) : students?.error ? (
            <p>{students?.error || "ERROR, please refresh."}</p>
          ) : students?.length > 0 ? (
            <div className="flex flex-row gap-5 flex-wrap justify-center">
              {students?.map((student) => (
                <div
                  key={student?.phone}
                  className="w-full max-w-[400px] flex flex-col gap-1 bg-white shadow-md p-5 border-2 border-red-500 rounded-md"
                >
                  <span className="font-[400]">
                    Name: <span className="font-[800]">{student?.name}</span>
                  </span>
                  <span className="font-[400]">
                    Phone: <span className="font-[800]">{student?.phone}</span>
                  </span>
                  <span className="font-[400] max-w-[400px] overflow-x-auto">
                    Email: <span className="font-[800]">{student?.email}</span>
                  </span>
                  <span className="font-[400]">
                    Gender:{" "}
                    <span className="font-[800]">{student?.gender}</span>
                  </span>
                  <button
                    onClick={() => {
                      newPasswordRef.current.value = student?.password || "";
                      setChangePasswordStudent(student);
                      document
                        .getElementById("change_password_modal")
                        .showModal();
                    }}
                    className="cursor-pointer p-2 block mx-auto mt-2 rounded-md bg-red-600 text-white text-[15px] font-[300] w-fit leading-[15px]"
                  >
                    Change Password
                  </button>
                </div>
              ))}
            </div>
          ) : (
            "No students yet."
          )}
        </div>
      </section>
      <dialog id="change_password_modal" className="modal">
        <div className="modal-box bg-white">
          <Title>Change Password</Title>
          <div className="flex flex-col justify-start gap-0 mb-6">
            <span className="font-[400]">
              Name:{" "}
              <span className="font-[800]">{changePasswordStudent?.name}</span>
            </span>
            <span className="font-[400]">
              Email:{" "}
              <span className="font-[800]">{changePasswordStudent?.email}</span>
            </span>
            <span className="font-[400]">
              Gender:{" "}
              <span className="font-[800]">
                {changePasswordStudent?.gender}
              </span>
            </span>
          </div>
          <form
            onSubmit={handleChangePassword}
            className="flex flex-col gap-3 justify-center items-center"
          >
            <input
              type="phone"
              placeholder="Phone Number"
              defaultValue={changePasswordStudent?.phone}
              disabled
              name="phone"
              className="w-full input input-bordered bg-white text-slate-800 disabled:bg-slate-300 disabled:border-none disabled:text-slate-800"
            />
            <input
              type="text"
              placeholder="Password"
              name="password"
              ref={newPasswordRef}
              defaultValue={changePasswordStudent?.password}
              className="w-full input input-bordered bg-white text-slate-800"
            />
            <button
              type="submit"
              className="bg-red-500 text-white text-[16px] font-[400] w-full text-center p-2 rounded-md mt-2"
            >
              Change Password
            </button>
          </form>
          <p className="text-[15px] block text-center text-slate-400 mt-3">
            To cancel/close, click outside this white area.
          </p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
export default Students;
