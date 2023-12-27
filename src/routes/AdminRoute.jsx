import toast from "react-hot-toast";
import BraveFavicon from "../assets/favicon-brave.jpg";
import useAxios from "../hooks/useAxios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const check = localStorage.getItem("be_admin")
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    axiosSecure
      .get(`/admin-login?username=${username}&password=${password}`)
      .then((res) => {
        if (res?.data?.message === "success" && res?.data?.token) {
          localStorage.setItem("be_admin", res?.data?.token)
          toast.success("Logged in as admin");
          return navigate("/admin");
        } else {
          toast.error("Incorrect credentials");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error: ${error?.message}`);
      });
  };

  if (!check) {
    return (
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
              Admin Login
            </h1>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full outline-none input input-bordered bg-white"
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
          </form>
        </div>
      </section>
    );
  } else {
    return children;
  }
};

export default AdminRoute;
