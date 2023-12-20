import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import useSettings from "../hooks/useSettings";

const Header = () => {
  const { setCurrentStep } = useSettings()
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  const isAccountPage = url.includes("enrolled-courses");
  const isAdminPage = url.includes("admin");

  return (
    <header className="w-full bg-indigo-800 backdrop-blur-sm bg-opacity-20 fixed top-0 left-0 z-[9999] shadow-md">
      <div className="w-full max-w-[960px] mx-auto flex flex-col sm:flex-row sm:justify-between items-center px-[12px] gap-3">
        <Link to="/" className="h-[70px] py-3">
          <img
            src={Logo}
            alt="Brave Education Logo"
            className="h-full object-contain"
          />
        </Link>

        <div className="text-[17px] 2xl:text-[20px] font-[600] flex flex-row gap-3 justify-between items-center flex-wrap w-full sm:w-fit text-rose-600 pb-2 sm:pb-0">
          <span>Hotline: <a href="tel:+01937805552">01937-805552</a></span>
          <button
            onClick={() => {
              if (isAccountPage || isAdminPage) {
                setCurrentStep(1)
                return navigate("/")
              } else {
                return navigate("/enrolled-courses")
              }
            }}
            className="text-white bg-rose-600 rounded-md py-1 px-3 bg-opacity-50 hover:bg-opacity-100"
          >
            {isAccountPage || isAdminPage ? "Courses" : "Account"}
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
