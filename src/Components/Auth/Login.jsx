import { Link, useNavigate } from "react-router-dom";
import BraveFavicon from "../../assets/favicon-brave.jpg";
import useAxios from "../../hooks/useAxios";
import { useState } from "react";
import toast from "react-hot-toast";
import Title from "../Title";
import { Helmet } from "react-helmet";

const Login = ({ setAuthState }) => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    const form = e.target;
    const { phone, password } = form;
    try {
      const result = await axiosSecure.get(
        `/student-login?phone=${phone?.value}&password=${password?.value}`
      );
      if (result?.data?.message === "success") {
        setLoggingIn(false);
        localStorage.setItem(
          "be_student",
          JSON.stringify(result?.data?.result)
        );
        toast.success(`Logged in as ${result?.data?.result?.name}`);
        return navigate("/enrolled-courses");
      } else {
        toast.error(result?.data?.message || "ERROR, please retry.");
        setLoggingIn(false);
      }
    } catch (error) {
      setLoggingIn(false);
      console.error(error);
      return toast.error(error?.message || "ERROR, please retry.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Brave Education</title>
      </Helmet>
      <section className="bg-white min-h-screen">
        <div className="min-h-[80vh] flex flex-col justify-center items-center gap-[70px] bg-white text-slate-900 text-[20px] font-[400] p-5">
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
            <h1 className="text-[25px] text-red-500 block text-left">Login</h1>
            <input
              type="number"
              className="w-full outline-none input input-bordered bg-white"
              placeholder="Phone"
              name="phone"
              required
            />
            <input
              type="password"
              className="w-full outline-none input input-bordered bg-white"
              placeholder="Password"
              name="password"
              required
            />
            <button
              type="button"
              onClick={() =>
                document.getElementById("forgot_password_modal").showModal()
              }
              className="text-red-500 text-[17px] font-[400] block w-fit ml-auto mt-[-10px]"
            >
              Forgot password?
            </button>
            <button
              type="submit"
              className="btn bg-red-500 text-[18px] text-white block w-full border-none disabled:opacity-60 disabled:text-slate-700"
              disabled={loggingIn}
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
      <dialog id="forgot_password_modal" className="modal">
        <div className="modal-box bg-white text-slate-800 text-[17px] md:text-[18px] font-[400]">
          <Title>Change Password</Title>
          <p>
            If you forgot your password and want to change/know it, please call
            our helpline at:{" "}
            <span className="text-red-500 font-[800] block text-center mt-1 mb-3 text-[20px]">
              01937-805552
            </span>
          </p>
          <p>
            Make sure to call with the exact phone number connected to the
            password you want to get back.
          </p>
          <p>
            আপনি যে নাম্বার এর পাসওয়ার্ড পুনরুদ্ধার করতে চান দয়া করে ঐ নাম্বার
            দিয়েই কল করবেন।
          </p>
          <p className="mt-3">
            Support opening hours:{" "}
            <span className="text-red-500 font-[700]">10am</span> to{" "}
            <span className="text-red-500 font-[700]">6pm</span>
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn bg-red-500 text-white text-[16px] px-6 border-none">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Login;
