import { useRef, useState } from "react";
import Title from "../../../Components/Title";
import useRegistrations from "../../../hooks/useRegistrations";
import { TfiReload } from "react-icons/tfi";
import Registration from "./Registration";
import { Helmet } from "react-helmet";

const Registrations = () => {
  const [findBy, setFindBy] = useState(null);

  const findByRef = useRef(null);

  let registrations = useRegistrations(findBy);
  const registrationsState = registrations;
  const registrationsRefetch = registrations?.refetch;
  registrations = registrations?.data;

  // console.log(registrations);

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
      <div className="flex flex-row justify-end">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFindBy(e.target.findBy.value);
          }}
          className="flex flex-row gap-[0px] w-fit border-2 border-rose-600 rounded-md overflow-hidden"
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
            className="py-2 px-3 bg-rose-600 text-slate-100"
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
      ) : registrations?.length > 0 ? (
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
              {registrations?.map((registration) => (
                <Registration
                  registration={registration}
                  refetch={registrationsRefetch}
                  key={registration?.uid}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-600 block w-full text-center p-3 pt-8">
          NO DATA
        </p>
      )}
    </section>
  );
};
export default Registrations;
