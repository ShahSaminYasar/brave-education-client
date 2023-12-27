import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useEnrolledCourses = (phoneNo = "null") => {
  const axios = useAxios();

  let url = `/enrolled-modules?phoneNo=${phoneNo}`;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getEnrolledCourses", phoneNo],
    queryFn: () => axios.get(url),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error };

  return data?.data;
};
export default useEnrolledCourses;
