import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useStudents = (findBy) => {
  const axios = useAxios();

  let url = `/students?token=${localStorage.getItem("be_admin")}`;
  if (findBy && findBy?.length > 0) {
    url = `/students?findBy=${findBy}&token=${localStorage.getItem(
      "be_admin"
    )}`;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getStudents", findBy],
    queryFn: () => axios.get(url),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error };

  return data?.data;
};
export default useStudents;
