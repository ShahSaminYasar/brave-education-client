import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useSchedule = (course, date) => {
  const axios = useAxios();

  let url = `/schedule?course=${course}`;
  if (course && date) {
    url = `/schedule?course=${course}&date=${date}`;
  } else if (course) {
    url = `/schedule?course=${course}`;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSchedule", course, date],
    queryFn: () => axios.get(url),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error };

  return data?.data;
};
export default useSchedule;
