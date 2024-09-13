import moment from "moment";
import Title from "../../../Components/Title";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";
import { MdDateRange } from "react-icons/md";
import { useState } from "react";

const PublishMockResult = () => {
  const axios = useAxios();

  const [publishing, setPublishing] = useState(false);

  const publishResult = async (e) => {
    event.preventDefault();
    setPublishing(true);

    const data = {
      id: e.target.id.value || "",
      number: e.target.number.value,
      name: e.target.name.value,
      listening: e.target.listening.value,
      reading: e.target.reading.value,
      writing: e.target.writing.value,
      speaking: e.target.speaking.value,
      overall: e.target.overall.value,
      date: moment(e.target.date.value).format("DD-MM-YYYY"),
    };

    const res = await axios.post("/mock-result", {
      data,
      token: localStorage.getItem("be_admin"),
    });

    if (res?.data?.message === "success") {
      e.target.id.value = "";
      e.target.number.value = "";
      e.target.name.value = "";
      e.target.listening.value = "";
      e.target.reading.value = "";
      e.target.writing.value = "";
      e.target.speaking.value = "";
      e.target.overall.value = "";

      setPublishing(false);

      return toast.success(`Result published successfully`);
    } else {
      setPublishing(false);
      return toast.error(res?.data?.message || "Failed, please retry");
    }
  };

  return (
    <section>
      <Title>Publish Mock Result</Title>
      <form
        className="flex flex-col lg:grid lg:grid-cols-3 gap-5"
        onSubmit={(e) => publishResult(e)}
      >
        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Student ID
          </span>
          <input
            type="text"
            placeholder="Student's ID"
            name="id"
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Phone Number
          </span>
          <input
            type="text"
            placeholder="Student's Phone Number"
            name="number"
            required
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Student&apos;s Name
          </span>
          <input
            type="text"
            placeholder="Student's Name"
            name="name"
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Test Date
          </span>
          <div className="w-full relative">
            <input
              type="date"
              placeholder="Date on which the test was attended"
              name="date"
              required
              className="input bg-white input-bordered w-full max-w-xs"
            />
            <MdDateRange className="text-lg text-slate-700 absolute top-[50%] -translate-y-[50%] right-3 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Listening Score
          </span>
          <input
            type="text"
            placeholder="Listening"
            name="listening"
            required
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Reading Score
          </span>
          <input
            type="text"
            placeholder="Reading Score"
            name="reading"
            required
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Writing Score
          </span>
          <input
            type="text"
            placeholder="Writing Score"
            name="writing"
            required
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Speaking Score
          </span>
          <input
            type="text"
            placeholder="Speaking Score"
            name="speaking"
            required
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-1 justify-start">
          <span className="text-slate-800 text-md font-semibold">
            Overall Score
          </span>
          <input
            type="text"
            placeholder="Overall Score"
            name="overall"
            required
            className="input bg-white input-bordered w-full max-w-xs"
          />
        </div>

        <button
          disabled={publishing}
          className="btn bg-red-600 border-0 text-white disabled:bg-red-800"
        >
          {publishing ? "Publishing" : "Publish Result"}
        </button>
      </form>
    </section>
  );
};

export default PublishMockResult;
