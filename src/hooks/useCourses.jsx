import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useCourses = (id, all) => {
  const axios = useAxios();

  let url = "/courses";
  if (id && all) {
    url = `/courses?id=${id}&all=true`;
  } else if(id){
    url = `/courses?id=${id}`;
  } else if(all){
    url = `/courses?all=true`;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getCourses", id],
    queryFn: () => axios.get(url),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error: error };
  return data?.data;
};
export default useCourses;
