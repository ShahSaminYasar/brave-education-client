import { NavLink, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  return (
    <section className="bg-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-7xl font-bold text-neutral-800 text-center">
        {error?.status || "Server Error"}
      </h1>
      <p className="text-lg text-neutral-500 font-normal text-center">
        {error?.statusText ||
          "Try refreshing. If the problem persists for a good amount of time, kindly contact us."}
      </p>
      <p className="text-lg text-neutral-500 font-normal text-center">
        Back to{" "}
        <NavLink to="/" className={`text-neutral-800 font-medium`}>
          Home
        </NavLink>
      </p>
    </section>
  );
};
export default Error;
