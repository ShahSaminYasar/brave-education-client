import { Link } from "react-router-dom";
import Logo from "../../assets/logo-color.png";
import SupportSVG from "../../assets/support.svg";

const MockHeader = () => {
  return (
    <header className={`w-full bg-white border-b-[3px] border-b-[#E94D4E]`}>
      <div className="w-full max-w-[960px] mx-auto flex flex-row justify-between items-center px-[12px] gap-3 text-[17px] 2xl:text-[20px] font-[600] text-[#E94D4E]">
        <button
          onClick={() => {
            window.location.replace("/");
          }}
          className="h-[70px] py-3"
        >
          <img
            src={Logo}
            alt="Brave Education Logo"
            className="h-full object-contain"
          />
        </button>

        <Link to="/" className="btn bg-red-600 border-0 text-white text-lg">
          Enroll
        </Link>
      </div>
    </header>
  );
};

export default MockHeader;
