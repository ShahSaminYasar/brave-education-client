import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useBatch = (courseId = "000000000000000000000000", batchId = "000000000000000000000000") => {
  const axios = useAxios();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getBatch", courseId, batchId],
    queryFn: () => axios.get(`/batch?courseId=${courseId}&batchId=${batchId}`),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error };

  return data?.data?.result;
};
export default useBatch;
