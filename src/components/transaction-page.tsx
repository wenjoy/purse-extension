import { BigNumber, Transaction, ethers } from "ethers";
import truncate from "../utils/truncate";

import Loader from "./loader";
import useSWR from "swr";

const TransactionPage = ({
  selectedWallet,
  selectedNetwork,
}: PageProps & { selectedNetwork: string }) => {
  const address = selectedWallet.wallet.address;
  const provider = new ethers.providers.EtherscanProvider(
    selectedNetwork,
    "C4YT7SIA975H8SYVH51W42MUQG1NENZ2HF"
  );
  const { data, error } = useSWR(
    [selectedNetwork, address],
    async (networkish, address) => {
      const history = await provider.getHistory(address);
      return history;
    }
  );

  const loading = !data && !error;

  const formatter = (v: BigNumber) => ethers.utils.formatEther(v);
  const typeFormater = (_: never, transacation: Transaction) => {
    let type = "";
    if (address === transacation.from) {
      type = "EXPENDITURE";
    } else if (address === transacation.to) {
      type = "INCOME";
    }

    return type;
  };
  const cols = [
    {
      name: "date",
      dataIndex: "timestamp",
      formatter: (v: number) => new Date(v * 1000).toDateString(),
    },
    { name: "type", dataIndex: "from", formatter: typeFormater },
    { name: "amount", dataIndex: "value", formatter },
    { name: "gas", dataIndex: "gasPrice", formatter },
    // { name: "reciever", dataIndex: "to", formatter: truncate },
    // { name: "hash", dataIndex: "hash", formatter: truncate },
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
          {data && data.length > 0 ? (
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  {cols.map(({ name }) => (
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-1 py-4 text-left capitalize"
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
                          {formatter
                            ? formatter(val as never, transacation)
                            : (val as string)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            "No history"
          )}
        </div>
      </Loader>
    </div>
  );
};
export default TransactionPage;
