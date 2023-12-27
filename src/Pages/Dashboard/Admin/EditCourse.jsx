import toast from "react-hot-toast";
import Title from "../../../Components/Title";
import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import moment from "moment";
import { FaTrash } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import useCourses from "../../../hooks/useCourses";
import { useQueryClient } from "@tanstack/react-query";

const EditCourse = () => {
  const { id: courseId } = useParams();
  let course = useCourses(courseId);
  const courseState = course;
  course = course?.[0];

  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("be_admin")

  const [updating, setUpdating] = useState(false);
  const [dateValue, setDateValue] = useState();
  const [schedule, setSchedule] = useState(course?.schedule);
  const [serviceType, setServiceType] = useState(course?.type);
  const [batches, setBatches] = useState(course?.batches);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [focusedBatch, setFocusedBatch] = useState(null);

  useEffect(() => {
    setSchedule(course?.schedule);
    setServiceType(course?.type);
    setBatches(course?.batches);
  }, [course]);

  if (courseState?.isLoading) {
    return "Loading...";
  } else if (courseState?.error) {
    return courseState?.error || "An error occured, please refresh.";
  }

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

  const handleAddBatch = () => {
    let id = Date.now();
    let name = `Batch ${batches?.length + 1}`;
    let capacity = 15;
    let enrolled = 0;
    let schedule = [];
    let duration = "";
    let batchObject = { id, name, capacity, enrolled, schedule, duration };
    setBatches([...batches, batchObject]);
  };

  const handleRemoveBatch = () => {
    let updatedBatchesArray = batches.filter(
      (batch) => batch?.id !== focusedBatch?.id
    );
    setBatches(updatedBatchesArray);
    setFocusedBatch({});
    setSelectedBatch(0);
  };

  const handleUpdateBatch = () => {
    let updatedBatchesArray = batches?.map((batch) =>
      batch?.id === focusedBatch?.id ? focusedBatch : batch
    );
    setBatches(updatedBatchesArray);
    // console.log(updatedBatchesArray);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const form = e.target;
    const { name, duration, price, offerPrice, status } = form;
    const thumbnail = form?.thumbnail?.files[0];
    let thumbnail_url = course?.thumbnail;
    if (thumbnail) {
      try {
        const uploadThumbnail = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_KEY
          }`,
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
          return setUpdating(false);
        }
      } catch (error) {
        toast.error(error?.message || "Error");
        setUpdating(false);
        return console.error(error);
      }
    }
    let data;
    if (serviceType === "test") {
      data = {
        name: name?.value,
        type: serviceType,
        duration: parseInt(duration?.value),
        price: parseInt(price?.value),
        offerPrice: parseInt(offerPrice?.value),
        active: Boolean(status?.value),
        thumbnail: thumbnail_url,
        schedule,
      };
    } else if (serviceType === "course") {
      data = {
        name: name?.value,
        type: serviceType,
        duration: parseInt(duration?.value),
        price: parseInt(price?.value),
        offerPrice: parseInt(offerPrice?.value),
        active: Boolean(status?.value),
        thumbnail: thumbnail_url,
        batches,
      };
    } else {
      setUpdating(false);
      return;
    }
    try {
      const response = await axiosSecure.put("/courses", { courseId, data, token });
      if (response?.data?.message === "success") {
        toast.success("Course data updated");
        setUpdating(false);
        queryClient.invalidateQueries(["getCourses"]);
        return navigate("/admin/courses");
      } else {
        setUpdating(false);
        return toast.error(
          response?.data?.message || "Failed to update course, please retry."
        );
      }
    } catch (error) {
      setUpdating(false);
      return toast.error(
        error?.message || "Failed to update course, please retry."
      );
    }
  };

  return (
    <section className="text-[17px] 2xl:text-[20px] text-slate-800 w-full">
      <form
        onSubmit={handleAddCourse}
        className="w-full max-w-[500px] mx-auto flex flex-col gap-3"
      >
        <Title className="mb-[0px]">Edit Course</Title>
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
            defaultValue={course?.name}
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
            defaultValue={course?.duration}
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
              defaultValue={course?.price}
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
              defaultValue={course?.offerPrice}
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
              defaultValue={course?.active ? "true" : "false"}
              className="select select-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
            >
              <option value="true">Active (Visible)</option>
              <option value="false">Inactive (Hidden)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="type"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Type
            </label>
            <select
              name="type"
              onChange={(e) => setServiceType(e.target.value)}
              value={serviceType}
              required
              className="select select-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
            >
              <option value="test">Test</option>
              <option value="course">Course</option>
            </select>
          </div>
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center w-full">
          <div>
            <label
              htmlFor="capacity"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Capacity
            </label>
            <input
              required
              name="capacity"
              type="number"
              placeholder="Seat Capacity"
              className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Enrolled
            </label>
            <input
              required
              name="enrolled"
              type="number"
              min={0}
              placeholder="Total enrolled"
              className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
            />
          </div>
        </div> */}
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
            className="file-input file-input-bordered border-2 border-indigo-300 file-input-md w-full bg-white"
          />
        </div>
        {serviceType === "test" ? (
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
                    defaultValue={date?.times?.map((time) => `${time?.time}`)}
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
        ) : (
          <div className="">
            <label
              htmlFor="batches"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Course Batches
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="w-full sm:col-span-1 flex flex-row gap-1 flex-wrap h-fit">
                {batches?.length > 0
                  ? batches?.map((batch) => (
                      <button
                        key={batch?.id}
                        type="button"
                        onClick={() => {
                          setSelectedBatch(batch?.id);
                          setFocusedBatch(
                            batches?.find((object) => object?.id === batch?.id)
                          );
                        }}
                        className={`text-[14px] font-[500] p-1 border-2 border-indigo-900 shadow-md rounded-md ${
                          batch?.id === selectedBatch
                            ? "bg-indigo-900 text-white"
                            : "bg-white text-indigo-900"
                        }`}
                      >
                        {batch.name}
                      </button>
                    ))
                  : "Please add a batch"}
                <button
                  type="button"
                  onClick={handleAddBatch}
                  className="btn btn-sm bg-blue-950 text-white font-[300] text block w-fit mr-auto mb-2 sm:w-full my-3 text-center"
                >
                  Add a batch
                </button>
              </div>
              <div className="w-full sm:col-span-2 sm:-mt-6">
                {selectedBatch > 0 && (
                  <div className="flex flex-col gap-2">
                    <div>
                      <label
                        htmlFor="batch_name"
                        className="text-[15px] text-slate-500 font-[400]"
                      >
                        Batch Name
                      </label>
                      <input
                        required
                        name="batch_name"
                        type="text"
                        value={focusedBatch?.name}
                        onChange={(e) =>
                          setFocusedBatch({
                            ...focusedBatch,
                            name: e.target.value,
                          })
                        }
                        placeholder="Name of the batch"
                        className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="batch_capacity"
                        className="text-[15px] text-slate-500 font-[400]"
                      >
                        Capacity
                      </label>
                      <input
                        required
                        name="batch_capacity"
                        type="number"
                        min={1}
                        value={focusedBatch?.capacity}
                        onChange={(e) => {
                          if (parseInt(e.target.value) >= 0) {
                            setFocusedBatch({
                              ...focusedBatch,
                              capacity: parseInt(e.target.value),
                            });
                          }
                        }}
                        placeholder="Max capacity of the batch"
                        className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="batch_enrolled"
                        className="text-[15px] text-slate-500 font-[400]"
                      >
                        Enrolled
                      </label>
                      <input
                        required
                        name="batch_enrolled"
                        type="number"
                        min={0}
                        value={focusedBatch?.enrolled}
                        onChange={(e) => {
                          if (parseInt(e.target.value) >= 0) {
                            setFocusedBatch({
                              ...focusedBatch,
                              enrolled: parseInt(e.target.value),
                            });
                          }
                        }}
                        placeholder="Enrolled students"
                        className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="batch_duration"
                        className="text-[15px] text-slate-500 font-[400]"
                      >
                        Batch Duration
                      </label>
                      <input
                        required
                        name="batch_duration"
                        type="text"
                        value={focusedBatch?.duration}
                        placeholder="Eg. 2 Months 15 Days"
                        onChange={(e) =>
                          setFocusedBatch({
                            ...focusedBatch,
                            duration: e.target.value,
                          })
                        }
                        className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="batch_duration"
                        className="text-[15px] text-slate-500 font-[400]"
                      >
                        Batch Schedule
                      </label>
                      <input
                        required
                        name="batch_schedule"
                        type="text"
                        value={focusedBatch?.schedule}
                        placeholder="Mon - 4pm to 5:30pm, Wed - 9am..."
                        onChange={(e) =>
                          setFocusedBatch({
                            ...focusedBatch,
                            schedule: e.target.value,
                          })
                        }
                        className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="batch_features"
                        className="text-[15px] text-slate-500 font-[400]"
                      >
                        Features
                      </label>
                      <textarea
                        required
                        name="batch_features"
                        type="text"
                        value={focusedBatch?.features}
                        placeholder="Feature = value"
                        onChange={(e) =>
                          setFocusedBatch({
                            ...focusedBatch,
                            features: e.target.value,
                          })
                        }
                        className="input input-bordered text-[17px] 2xl:text-[20px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 border-indigo-300 focus:border-[#4438caa6] min-h-[150px] px-4 py-2"
                      >{}</textarea>
                    </div>
                    <div className="flex flex-row gap-1 flex-wrap justify-end">
                      <button
                        type="button"
                        onClick={handleRemoveBatch}
                        className="btn btn-sm bg-red-600 text-white font-[300] text block w-fit my-0"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateBatch}
                        className="btn btn-sm bg-blue-950 text-white font-[300] text block w-fit my-0"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          className="bg-indigo-700 text-white text-[16x] font-[400] py-2 px-3 rounded-md my-3 disabled:opacity-50"
          disabled={updating}
        >
          {updating ? (
            <span className="loading loading-spinner text-[20px] -mb-[6px]"></span>
          ) : (
            "Update Data"
          )}
        </button>
      </form>
    </section>
  );
};
export default EditCourse;
