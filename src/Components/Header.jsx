import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";

const Header = () => {
  const location = useLocation();
  const url = location.pathname;
  const isAccountPage = url.includes("enrolled-courses")
  const isAdminPage = url.includes("admin")
  console.log(isAccountPage)
  return (
    <header className="w-full bg-indigo-800 backdrop-blur-sm bg-opacity-20 fixed top-0 left-0 z-[9999]">
      <div className="w-full max-w-[960px] mx-auto flex flex-col sm:flex-row sm:justify-between items-center px-[12px] gap-3">
        <Link to="/" className="h-[70px] py-3">
          <img
            src={Logo}
            alt="Brave Education Logo"
            className="h-full object-contain"
          />
        </Link>

        <div className="text-[17px] font-[600] flex flex-row gap-3 justify-between items-center flex-wrap w-full sm:w-fit text-rose-600 pb-2 sm:pb-0">
          <span>Hotline: 01916-074609</span>
          <Link
            to={isAccountPage || isAdminPage ? "/" : "/enrolled-courses"}
            className="text-white bg-rose-600 rounded-md py-1 px-3 bg-opacity-50 hover:bg-opacity-100"
          >
            {isAccountPage || isAdminPage ? "Courses" : "Account"}
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header;
