import { Link } from "react-router-dom";
import BraveFavicon from "../../assets/favicon-brave.jpg";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import { useState } from "react";
import { Helmet } from "react-helmet";

const Register = ({ setAuthState }) => {
  const tempUser = JSON.parse(localStorage.getItem("be_student_temp"));

  const axiosSecure = useAxios();

  const [registering, setRegistering] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    const form = e.target;
    const { name, phone, email, gender, password, repassword } = form;
    if (password?.value !== repassword?.value) {
      setRegistering(false);
      return toast.error("Passwords don't match!");
    }
    const data = {
      name: name?.value,
      phone: phone?.value,
      email: email?.value,
      gender: gender?.value,
      password: password?.value,
    };
    const result = await axiosSecure.post("/student-register", { data });
    if (result?.data?.message === "success") {
      setRegistering(false);
      toast.success("Account created successfully, please login.");
      return setAuthState("login");
    } else {
      setRegistering(false);
      return toast.error(result?.data?.message);
    }
  };

  return (
    <section className="bg-white min-h-screen py-20">
      <Helmet>
        <title>Register | Brave Education</title>
      </Helmet>
      <div className="min-h-[80vh] flex flex-col justify-center items-center gap-[70px] bg-white text-slate-900 text-[20px] font-[400] p-5">
        <Link to="/">
          <img
            src={BraveFavicon}
            alt="Brave Education Logo"
            className="w-[120px] aspect-square rounded-full object-contain"
          />
        </Link>
        <form
          onSubmit={handleRegister}
          className="text-[20px] font-[400] text-slate-900 flex flex-col gap-1 items-start shadow-md p-5 w-full max-w-[400px]"
        >
          <h1 className="text-[25px] text-red-500 block text-left">Register</h1>
          <label htmlFor="name" className="text-[16px] text-slate-400 mt-4">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={tempUser?.name || ""}
            className="w-full outline-none input input-bordered bg-white"
          />
          <label htmlFor="name" className="text-[16px] text-slate-400 mt-4">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            disabled={tempUser?.phone}
            defaultValue={tempUser?.phone || ""}
            className="w-full outline-none input input-bordered bg-white disabled:bg-slate-200 disabled:border-none disabled:outline-none disabled:text-slate-700"
          />
          <label htmlFor="name" className="text-[16px] text-slate-400 mt-4">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={tempUser?.email || ""}
            className="w-full outline-none input input-bordered bg-white"
          />
          <label htmlFor="name" className="text-[16px] text-slate-400 mt-4">
            Gender
          </label>
          <select
            name="gender"
            required
            className="select select-bordered bg-white w-full"
            defaultValue="male"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label htmlFor="name" className="text-[16px] text-slate-400 mt-4">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full outline-none input input-bordered bg-white"
          />
          <label htmlFor="name" className="text-[16px] text-slate-400 mt-4">
            Confirm Password
          </label>
          <input
            type="password"
            name="repassword"
            placeholder="Confirm Password"
            className="w-full outline-none input input-bordered bg-white"
          />
          <button
            type="submit"
            className="btn bg-red-500 text-[18px] text-white block w-full border-none disabled:opacity-60 disabled:text-slate-800 mt-4"
            disabled={registering}
          >
            {registering ? "Processing..." : "Register"}
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
  );
};

export default Register;
