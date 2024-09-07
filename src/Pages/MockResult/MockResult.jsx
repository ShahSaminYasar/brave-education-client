import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import moment from "moment";
import {
  FaHeadphones,
  FaBookOpen,
  FaPencil,
  FaMicrophone,
} from "react-icons/fa6";
import Header from "../../Components/Header";

const MockResult = () => {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState();
  const axios = useAxios();

  const checkResult = async (e) => {
    event.preventDefault();

    const id = e.target.id.value;
    const date = moment(e.target.date.value).format("DD-MM-YYYY");

    const res = await axios.get(`/mock-result?id=${id}&date=${date}`);
    if (res?.data?.message === "success") {
      setResult(res?.data?.result);
      setStep(2);
    } else {
      return toast.error(res?.data?.message || "Failed, please retry");
    }
  };

  const reset = () => {
    setStep(1);
  };

  return (
    <>
      <section className="w-full min-h-screen bg-[#211D51] py-10 px-3 flex flex-col items-center gap-10 justify-center">
        {step == 1 ? (
          <>
            <span className="text-4xl lg:text-5xl font-bold text-white text-center block">
              Get your <span className="text-red-600">Mock Test</span> result
            </span>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => checkResult(e)}
            >
              <div className="flex flex-row gap-7 flex-wrap justify-center">
                <div className="flex flex-col gap-1 justify-start">
                  <span className="text-white text-md font-semibold">
                    ID/Phone Number
                  </span>
                  <input
                    type="text"
                    placeholder="ID/Phone Number"
                    name="id"
                    required
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>

                <div className="flex flex-col gap-1 justify-start">
                  <span className="text-white text-md font-semibold">
                    Date of test
                  </span>
                  <input
                    type="date"
                    placeholder="Test Date"
                    name="date"
                    required
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn bg-red-600 text-white border-0"
              >
                Check
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-row flex-wrap justify-center items-center">
            {result ? (
              <div className="flex flex-col items-start gap-1">
                <span className="p-3 rounded-3xl border-4  border-red-600 text-white font-bold text-2xl lg:text-3xl block w-full text-center mb-4">
                  Your Mock Test Result
                </span>
                {result?.name && (
                  <span className="text-white font-bold text-xl lg:text-3xl block w-full text-left">
                    Name: <span className="text-red-600">{result?.name}</span>
                  </span>
                )}
                <span className="text-white font-bold text-xl lg:text-3xl block w-full text-left mb-5">
                  Test date:{" "}
                  <span className="text-red-600">
                    {moment(result?.date).format("DD MMM YYYY")}
                  </span>
                </span>
                <div className="w-full flex flex-row flex-wrap justify-center gap-6 mb-5">
                  <div className="rounded-xl bg-white p-3 flex flex-col justify-center items-center w-[120px] h-[130px] lg:w-[160px] lg:h-[170px]">
                    <FaHeadphones className="text-4xl lg:text-6xl mb-2" />
                    <span className="text-xl lg:text-3xl font-bold">
                      Listening
                    </span>
                    <span className="text-2xl lg:text-4xl font-bold">
                      {result?.listening}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-3 flex flex-col justify-center items-center w-[120px] h-[130px] lg:w-[160px] lg:h-[170px]">
                    <FaBookOpen className="text-4xl lg:text-6xl mb-2" />
                    <span className="text-xl lg:text-3xl font-bold">
                      Reading
                    </span>
                    <span className="text-2xl lg:text-4xl font-bold">
                      {result?.reading}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-3 flex flex-col justify-center items-center w-[120px] h-[130px] lg:w-[160px] lg:h-[170px]">
                    <FaPencil className="text-4xl lg:text-6xl mb-2" />
                    <span className="text-xl lg:text-3xl font-bold">
                      Writing
                    </span>
                    <span className="text-2xl lg:text-4xl font-bold">
                      {result?.writing}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-3 flex flex-col justify-center items-center w-[120px] h-[130px] lg:w-[160px] lg:h-[170px]">
                    <FaMicrophone className="text-4xl lg:text-6xl mb-2" />
                    <span className="text-xl lg:text-3xl font-bold">
                      Speaking
                    </span>
                    <span className="text-2xl lg:text-4xl font-bold">
                      {result?.speaking}
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl lg:rounded-3xl bg-red-600 text-white w-full text-center px-3 py-3 lg:px-4 lg:py-5">
                  <span className="text-2xl lg:text-3xl font-bold">
                    Overall:{" "}
                  </span>
                  <span className="text-3xl lg:text-4xl font-bold">
                    {result?.overall}
                  </span>
                </div>
                <button
                  className="btn bg-white text-slate-800 border-0 my-2 ml-auto"
                  onClick={() => reset()}
                >
                  Search again
                </button>
                <span className="text-white block w-full text-center mt-10">
                  For any inquiries, please contact{" "}
                  <a
                    href="tel:01937805552"
                    className="text-red-600 font-semibold"
                  >
                    01937805552
                  </a>
                </span>
              </div>
            ) : (
              <>
                <div className="bg-white p-3 rounded-lg text-slate-800 text-center text-lg flex flex-col gap-1">
                  <span>
                    There is no result published with the provided ID/number and
                    date.
                  </span>
                  <span>
                    Please check the ID/number and date and try again.
                  </span>
                  <span>
                    If you are sure about the credentials, then please wait
                    patiently until your result is published.
                  </span>
                  <span>
                    Helpline:{" "}
                    <a
                      href="tel:01937805552"
                      className="text-red-600 font-semibold"
                    >
                      01937805552
                    </a>
                  </span>
                </div>
                <button
                  className="btn bg-red-600 text-white border-0 my-2 ml-auto"
                  onClick={() => reset()}
                >
                  Search again
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default MockResult;
