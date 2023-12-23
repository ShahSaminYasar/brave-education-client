import moment from "moment";
import useCourses from "../../../hooks/useCourses";
import useBatch from "../../../hooks/useBatch";

const Registration = ({ registration }) => {
  const courseDetails = useCourses(registration?.course);
  const batchDetails = useBatch(courseDetails?.[0]?._id, registration?.batch);

  return (
    <tr className="even:bg-slate-100 border-b-slate-200 font-[400]">
      <td>
        <div className="flex flex-col gap-1">
          <span>
            Name: <span className="font-[600]">{registration?.name}</span>
          </span>
          <span>
            Phone: <span className="font-[600]">{registration?.phone}</span>
          </span>
          <span>
            Email: <span className="font-[600]">{registration?.email}</span>
          </span>
          <span>
            Gender: <span className="font-[600]">{registration?.gender}</span>
          </span>
        </div>
      </td>
      <td>
        <div className="flex flex-col gap-1">
          <span>
            Course:{" "}
            {courseDetails?.isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <span className="font-[600] text-indigo-900">
                {courseDetails?.[0]?.name}
              </span>
            )}
          </span>
          {registration?.batch ? (
            <span>
              Batch:{" "}
              <span className="font-[600] text-indigo-900">
                {batchDetails?.name}
              </span>
            </span>
          ) : (
            <span>
              Schedule:{" "}
              <span className="font-[600] text-indigo-900">
                {registration?.time}
              </span>
              ,{" "}
              <span className="font-[600] text-indigo-900">
                {moment(registration?.date).format("D MMM YYYY")}
              </span>
            </span>
          )}
          <span>
            Registered on:
            <span className="font-[600]">
              {" "}
              {moment(registration?.registeredOn).format("hh:mmA[,] DD/MM/y")}
            </span>
          </span>
        </div>
      </td>
      <td>
        <div className="flex flex-col gap-1">
          <span className="font-[600] text-indigo-900">
            {registration?.uid}
          </span>
          <span
            className={`font-[600] ${
              registration?.paid ? "text-teal-700" : "text-red-700"
            }`}
          >
            {registration?.paid ? "PAID" : "UNPAID"}
          </span>
        </div>
      </td>
    </tr>
  );
};
export default Registration;
