import toast from "react-hot-toast";
import Title from "../../../Components/Title";
import useAxios from "../../../hooks/useAxios";
import { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import moment from "moment";
import { FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [schedule, setSchedule] = useState([]);

  const handleAddDate = () => {
    const check = schedule?.find((shift) => shift?.date === dateValue);
    if (check) {
      return toast("Date already added");
    } else if (!dateValue) {
      return toast("A date is required");
    }
    const dateObject = {
      date: dateValue,
      times: [],
    };
    setSchedule([...schedule, dateObject]);
  };

  const handleRemoveDate = (index) => {
    const updatedSchedule = [
      ...schedule.slice(0, index),
      ...schedule.slice(index + 1),
    ];
    setSchedule(updatedSchedule);
  };

  const handleAddTime = (date, times) => {
    const timesArray = times
      ?.split(",")
      ?.map((time) => ({ time: time?.trim(), enrolled: 0 }));
    let updatedSchedule = schedule;
    updatedSchedule[date].times = timesArray;
    setSchedule(updatedSchedule);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setAdding(true);
    const form = e.target;
    const { name, duration, price, offerPrice, status } = form;
    const thumbnail = form?.thumbnail?.files[0];
    let thumbnail_url;
    try {
      const uploadThumbnail = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        {
          image: thumbnail,
        },
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      if (uploadThumbnail.data.success === true) {
        thumbnail_url = uploadThumbnail?.data?.data?.display_url;
      } else {
        toast.error("Failed to upload thumbnail");
        return setAdding(false);
      }
    } catch (error) {
      toast.error(error?.message || "Error");
      setAdding(false);
      return console.error(error);
    }
    const data = {
      name: name?.value,
      duration: parseInt(duration?.value),
      price: parseInt(price?.value),
      offerPrice: parseInt(offerPrice?.value),
      active: Boolean(status?.value),
      thumbnail: thumbnail_url,
    };
    // console.log("DATA: ", data, "SCHEDULE: ", schedule);
    const response = await axiosSecure.post("/courses", { data, schedule });
    if (response?.data?.message === "success") {
      toast.success("Course published");
      setAdding(false);
      return navigate("/admin/courses");
    } else {
      setAdding(false);
      return toast.error(
        response?.data?.message || "Failed to publish course, please retry."
      );
    }
  };

  return (
    <section className="text-[17px] 2xl:text-[20px] text-slate-800 w-full">
      <form
        onSubmit={handleAddCourse}
        className="w-full max-w-[500px] mx-auto flex flex-col gap-3"
      >
        <Title className="mb-[0px]">Add Course</Title>
        <div>
          <label
            htmlFor="name"
            className="text-[15px] text-slate-500 font-[400]"
          >
            Course Name
          </label>
          <input
            required
            name="name"
            type="text"
            placeholder="Name of the course/test"
            className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
          />
        </div>
        <div>
          <label
            htmlFor="duration"
            className="text-[15px] text-slate-500 font-[400]"
          >
            Course Duration
          </label>
          <input
            required
            name="duration"
            type="number"
            placeholder="Duration of the course/test (in minutes)"
            className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 items-center w-full">
          <div>
            <label
              htmlFor="price"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Price
            </label>
            <input
              required
              name="price"
              type="number"
              placeholder="Price (0 for 'Free')"
              className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
            />
          </div>
          <div>
            <label
              htmlFor="offerPrice"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Offer Price
            </label>
            <input
              required
              name="offerPrice"
              type="number"
              placeholder="Set 0 for 'Free'"
              className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center w-full">
          <div>
            <label
              htmlFor="status"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Status
            </label>
            <select
              name="status"
              required
              defaultValue="true"
              className="select select-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
            >
              <option value="true">Active (Visible)</option>
              <option value="false">Inactive (Hidden)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="thumbnail"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Thumbnail
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              required
              className="file-input file-input-bordered border-2 border-indigo-300 file-input-md w-full bg-white"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="schedule"
            className="text-[15px] text-slate-500 font-[400]"
          >
            Schedule
          </label>
          {schedule?.map((date) => (
            <div
              key={date?.date}
              className="flex flex-row justify-end text-[15px] text-slate-800 mb-1"
            >
              <div className="w-full flex items-center flex-row border-[1px] border-indigo-200 rounded-l-md overflow-hidden">
                <span className="bg-indigo-500 p-2 text-white w-[140px] text-center">
                  {date?.date}
                </span>
                <input
                  type="text"
                  onBlur={(e) =>
                    handleAddTime(schedule.indexOf(date), e.target.value)
                  }
                  className="bg-white p-2 w-full border-none outline-none"
                  placeholder="00:00AM, 10:30AM, 12:00PM, 06:45PM..."
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDate(schedule.indexOf(date))}
                className="text-[17px] text-white bg-rose-500 rounded-sm overflow-hidden px-2"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <div className="flex flex-col items-end gap-2 max-w-[350px] mx-auto mt-3">
            <Calendar
              minDate={new Date()}
              value={dateValue}
              onChange={(value) =>
                setDateValue(moment(value).format("YYYY-MM-DD"))
              }
            />
            <button
              type="button"
              onClick={handleAddDate}
              className="btn btn-sm bg-blue-950 text-white font-[300] text"
            >
              Add Date
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-indigo-700 text-white text-[16x] font-[400] py-2 px-3 rounded-md my-3 disabled:opacity-50"
          disabled={adding}
        >
          {adding ? (
            <span className="loading loading-spinner text-[20px] -mb-[6px]"></span>
          ) : (
            "Add Course"
          )}
        </button>
      </form>
    </section>
  );
};
export default AddCourse;
