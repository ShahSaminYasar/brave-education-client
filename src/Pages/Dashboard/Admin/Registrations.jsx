import { useEffect, useRef, useState } from "react";
import Title from "../../../Components/Title";
import useRegistrations from "../../../hooks/useRegistrations";
import { TfiReload } from "react-icons/tfi";
import Registration from "./Registration";
import { Helmet } from "react-helmet";
import moment from "moment";

const Registrations = () => {
  const [findBy, setFindBy] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const findByRef = useRef(null);

  let registrations = useRegistrations(findBy);
  const registrationsState = registrations;
  const registrationsRefetch = registrations?.refetch;
  registrations = registrations?.data;

  const [regs, setRegs] = useState([]);

  useEffect(() => {
    if (!registrationsState?.isLoading) {
      if (filterDate?.length > 0) {
        console.log("Filtering:", [
          regs?.find((reg) => reg?.date === filterDate),
        ]);
        let newRegs = regs?.find((reg) => reg?.date === filterDate);
        if (newRegs) {
          setRegs([regs?.find((reg) => reg?.date?.includes(filterDate))]);
        }
      } else {
        let newRegs = [];
        registrations?.forEach((registration) => {
          let date = moment(registration?.registeredOn).format("DD MMMM YYYY");
          let find = newRegs?.find((object) => object?.date === date);
          if (find) {
            find?.registrations?.push(registration);
          } else {
            let newReg = { date: date, registrations: [registration] };
            newRegs?.push(newReg);
          }
        });
        console.log(newRegs);
        setRegs(newRegs);
      }
    }
  }, [registrations, filterDate]);

  return (
    <section className="text-[17px] 2xl:text-[20px] text-slate-800 w-full">
      <Helmet>
        <title>Registrations | Brave Education</title>
      </Helmet>
      <div className="flex flex-row flex-wrap justify-between items-center w-full mb-3">
        <Title>Registrations</Title>
        <button
          onClick={() => {
            setFindBy("");
            findByRef.current.value = "";
            registrationsRefetch;
          }}
        >
          <TfiReload className="-mt-[7px]" />
        </button>
      </div>
      <div className="flex flex-row justify-between items-center flex-wrap gap-5 mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-row gap-[0px] w-fit border-2 border-[#E94D4E] rounded-md overflow-hidden"
        >
          <input
            type="text"
            name="filterDateInput"
            placeholder="Eg. 01 January 2024"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-white text-slate-900 py-2 px-3 outline-none"
          />
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFindBy(e.target.findBy.value);
          }}
          className="flex flex-row gap-[0px] w-fit border-2 border-[#E94D4E] rounded-md overflow-hidden"
        >
          <input
            type="text"
            name="findBy"
            ref={findByRef}
            placeholder="UID/Name"
            className="bg-white text-slate-900 py-2 px-3 outline-none"
          />
          <button
            type="submit"
            className="py-2 px-3 bg-[#E94D4E] text-slate-100"
          >
            Find
          </button>
        </form>
      </div>
      {registrationsState?.isLoading ? (
        <div className="w-full p-5 flex justify-center">
          <span className="loading loading-spinner"></span>
        </div>
      ) : registrationsState?.error ? (
        <p className="text-[17px] 2xl:text-[20px] text-red-500">
          {registrationsState?.error || "An error occured, please refresh."}
        </p>
      ) : regs?.length > 0 ? (
        regs?.length > 0 &&
        regs?.map((reg) => (
          <>
            <span className="text-[18px] font-[500] block -mb-[20px] pb-1 border-b-[1px] border-b-[#191E24]">
              {reg?.date}
            </span>
            <div className="overflow-x-auto my-6">
              <table className="table text-[17px] 2xl:text-[20px] text-slate-800 font-[500]">
                {/* head */}
                <thead>
                  <tr className="text-[17px] 2xl:text-[20px] text-slate-700 font-[600]">
                    <th>Details</th>
                    <th>Course & Schedule</th>
                    <th>UID</th>
                  </tr>
                </thead>
                <tbody>
                  {reg?.registrations?.map((registration) => (
                    // <tr>Hello</tr>
                    <Registration
                      registration={registration}
                      refetch={registrationsRefetch}
                      key={registration?.uid}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))
      ) : (
        <p className="text-slate-600 block w-full text-center p-3 pt-8">
          NO DATA
        </p>
      )}
    </section>
  );
};
export default Registrations;
