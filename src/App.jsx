import Courses from "./Pages/Courses";
import Datetime from "./Pages/Datetime";
import Details from "./Pages/Details";
import Cart from "./Pages/Cart";
import Confirmation from "./Pages/Confirmation";
import useSettings from "./hooks/useSettings";
import Header from "./Components/Header";
import { Helmet } from "react-helmet";

const App = () => {
  const { steps, currentStep } = useSettings();

  return (
    <>
      <Helmet>
        <title>Enroll | Brave Education</title>
      </Helmet>
      <Header />
      <main className="bg-transparent flex flex-col justify-center items-center py-5 text-[17px] 2xl:text-[20px] px-3">
        <div className="w-full max-w-[700px] mt-[140px] sm:mt-[100px]">
          <ul className="steps text-slate-600 text-[17px] 2xl:text-[20px] w-full">
            {steps?.map((step) => (
              <li
                key={step}
                className={`step capitalize ${
                  steps?.indexOf(step) + 1 <= currentStep
                    ? "step-primary text-[#E94D4E]"
                    : ""
                }`}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-[#fbfaff] to-[#ebe8ff] border-2 border-indigo-700 shadow-md w-full max-w-[660px] mx-auto py-5 px-5 my-5 rounded-md">
          {currentStep === 1 ? (
            <Courses />
          ) : currentStep === 2 ? (
            <Datetime />
          ) : currentStep === 3 ? (
            <Details />
          ) : currentStep === 4 ? (
            <Cart />
          ) : currentStep === 5 ? (
            <Confirmation />
          ) : (
            "ERROR"
          )}
        </div>
      </main>
    </>
  );
};
export default App;
