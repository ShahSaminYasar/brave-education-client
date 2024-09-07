import { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import moment from "moment";
import toast from "react-hot-toast";

const MockResults = () => {
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(true);

  const axios = useAxios();

  useEffect(() => {
    setLoading(true);
    const fetchResults = async () => {
      const getResults = await axios.get("/mock-result");
      setResults(getResults?.data?.result);
      setLoading(false);
    };
    fetchResults();
  }, []);

  const deleteResult = async (id) => {
    const warn = confirm("Are you sure you want to delete?");
    if (warn) {
      const result = await axios.delete(
        `/mock-result?id=${id}&token=${localStorage.getItem("be_admin")}`
      );
      if (result?.data?.message === "success") {
        console.log("Success");
        return window.location.reload();
      } else {
        return toast.error("Failed to delete!");
      }
    }
  };

  return (
    <div className="flex flex-row gap-6 flex-wrap">
      {loading
        ? "Loading..."
        : results?.map((result) => (
            <div className="flex flex-col gap-1 text-white text-lg shadow-md bg-blue-500 rounded-xl min-w-[280px] p-4">
              <span>Name: {result?.name}</span>
              <span>ID: {result?.id || ""}</span>
              <span>Phone: {result?.number}</span>
              <span>
                Date: {moment(result?.date, "DD-MM-YYYY").format("DD MMM YYYY")}
              </span>
              <span>Listening: {result?.listening}</span>
              <span>Reading: {result?.reading}</span>
              <span>Writing: {result?.writing}</span>
              <span>Speaking: {result?.speaking}</span>
              <span>Overall: {result?.overall}</span>
              <button
                onClick={() => deleteResult(result?._id)}
                className="bg-red-600 btn text-white text-lg w-fit ml-auto"
              >
                Delete
              </button>
            </div>
          ))}
    </div>
  );
};

export default MockResults;
