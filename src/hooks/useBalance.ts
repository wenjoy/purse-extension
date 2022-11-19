import useSWR from "swr";
const useBalance = (
  args: any[],
  fetcher: (address: Address) => Promise<any>
) => {
  const { data, error } = useSWR(args, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    balance: data,
    loading: !data && !error,
    error: error,
  };
};
export default useBalance;
