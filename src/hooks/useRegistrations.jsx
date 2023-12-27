import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useRegistrations = (findBy) => {
  const axios = useAxios();
  const token = localStorage.getItem("be_admin");

  let url = `/registrations?token=${token}`;

  if (findBy) {
    url = `/registrations?findBy=${findBy}&token=${token}`;
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getRegistrations", findBy],
    queryFn: () => axios.get(url),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error };

  return { data: data?.data?.result, refetch };
};
export default useRegistrations;
