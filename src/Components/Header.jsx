import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo-color.png";
import useSettings from "../hooks/useSettings";
import SupportSVG from "../assets/support.svg";
import { useState } from "react";

const Header = () => {
  const { setCurrentStep } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  const isAccountPage = url.includes("enrolled-courses");
  const isAdminPage = url.includes("admin");

  const [scrolled, setScrolled] = useState(false);

  window.onscroll = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <>
      <header
        className={`w-full bg-slate-100 backdrop-blur-sm bg-opacity-100 fixed top-0 left-0 z-[9999] shadow-md border-b-[3px] border-b-[#E94D4E] hidden sm:block`}
      >
        <div className="w-full max-w-[960px] mx-auto flex flex-row justify-between items-center px-[12px] gap-3 text-[17px] 2xl:text-[20px] font-[600] text-[#E94D4E]">
          <span className="flex flex-row gap-1 items-center">
            <img src={SupportSVG} alt="Support Icon" className="w-[40px]" />
            <a href="tel:+01937805552">01937-805552</a>
          </span>

          <Link to="/" className="h-[70px] py-3">
            <img
              src={Logo}
              alt="Brave Education Logo"
              className="h-full object-contain"
            />
          </Link>

          <button
            onClick={() => {
              if (isAccountPage || isAdminPage) {
                setCurrentStep(1);
                return navigate("/");
              } else {
                return navigate("/enrolled-courses");
              }
            }}
            className="text-white bg-[#E94D4E] rounded-md py-1 px-3 bg-opacity-100 hover:bg-opacity-100"
          >
            {isAccountPage || isAdminPage ? "Courses" : "Account"}
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className={`w-full bg-slate-100 backdrop-blur-sm bg-opacity-100 fixed top-0 left-0 z-[9999] shadow-md border-b-[3px] border-b-[#E94D4E] sm:hidden ${
          scrolled
            ? "-translate-y-[70px] sm:-translate-y-[0px]"
            : "-translate-y-[0px]"
        }`}
      >
        <div
          className={`w-full max-w-[960px] mx-auto flex flex-col sm:flex-row sm:justify-between items-center px-[12px] gap-3`}
        >
          <Link to="/" className="h-[70px] py-3">
            <img
              src={Logo}
              alt="Brave Education Logo"
              className="h-full object-contain"
            />
          </Link>

          <div
            className={`text-[17px] 2xl:text-[20px] font-[600] flex flex-row gap-3 justify-between items-center flex-wrap w-full sm:w-fit text-[#E94D4E] pb-2 sm:pb-0`}
          >
            <span className="flex flex-row gap-1 items-center">
              <img src={SupportSVG} alt="Support Icon" className="w-[40px]" />
              <a href="tel:+01937805552">01937-805552</a>
            </span>
            <button
              onClick={() => {
                if (isAccountPage || isAdminPage) {
                  setCurrentStep(1);
                  return navigate("/");
                } else {
                  return navigate("/enrolled-courses");
                }
              }}
              className="text-white bg-[#E94D4E] rounded-md py-1 px-3 bg-opacity-100 hover:bg-opacity-100"
            >
              {isAccountPage || isAdminPage ? "Courses" : "Account"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
