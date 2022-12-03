import { BigNumber, ethers } from "ethers";
import truncate from "../utils/truncate";

import Loader from "./loader";
import useSWR from "swr";

const TransactionPage = ({ selectedWallet }: PageProps) => {
  const address = selectedWallet.wallet.address;
  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    "C4YT7SIA975H8SYVH51W42MUQG1NENZ2HF"
  );
  const { data, error } = useSWR("transaction-history", async () => {
    const history = await provider.getHistory(address);
    console.log("his", history);
    return history;
  });

  const loading = !data && !error;
  console.log("data", data);

  const formatter = (v: BigNumber) => ethers.utils.formatEther(v);
  const cols = [
    {
      name: "date",
      dataIndex: "timestamp",
      formatter: (v: number) => new Date(v * 1000).toDateString(),
    },
    { name: "sender", dataIndex: "from", formatter: truncate },
    { name: "reciever", dataIndex: "to", formatter: truncate },
    { name: "amount", dataIndex: "value", formatter },
    { name: "hash", dataIndex: "hash", formatter: truncate },
    { name: "gas", dataIndex: "gasPrice", formatter },
  ];

  return (
    <div>
      <h1 className="flex align-middle p-2">
        Transaction history of{" "}
        <b className="inline-block flex-1 text-ellipsis overflow-hidden ml-1">
          {truncate(address)}
        </b>
      </h1>
      <Loader loading={loading}>
        <div className="overflow-x-auto min-w-full">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                {cols.map(({ name }) => (
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-1 py-4 text-left"
                    key={name}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((transacation) => (
                <tr
                  key={transacation.hash}
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  {cols.map(({ dataIndex, formatter }) => {
                    const val =
                      transacation[
                        dataIndex as keyof ethers.providers.TransactionResponse
                      ];
                    return (
                      <td
                        key={dataIndex}
                        className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap"
                      >
                        {formatter ? formatter(val as any) : (val as string)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Loader>
    </div>
  );
};
export default TransactionPage;
