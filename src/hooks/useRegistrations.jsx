import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useRegistrations = (findBy) => {
  const axios = useAxios();

  let url = "/registrations";

  if (findBy) {
    url = `/registrations?findBy=${findBy}`;
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
