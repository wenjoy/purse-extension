import { EthersContext, Provider } from "../context";
import { utils } from "ethers";
import Loader from "../components/loader";
import TabPanel from "../components/tabpanel";
import logger from "../service/logger";
import useBalance from "../hooks/useBalance";

const TokenPage = ({ selectedWallet, provider }: PageProps) => {
  const isValidAddress = (address: string) => {
    if (address.length > 0) {
      return true;
    } else {
      logger.info("logger: invalid address");
      return false;
    }
  };

  const requestBalance = async (selected: Address, provider: Provider) => {
    let balance = "";

    if (isValidAddress(selected) && provider) {
      const value = await provider.getBalance(selected);
      balance = utils.formatEther(value);
    }
    return balance;
  };

  const { balance, loading } = useBalance(
    [selectedWallet?.wallet.address, provider],
    (address: Address) => requestBalance(address, provider)
  );

  return (
    <section className="container flex-1 space-y-4 p-5 flex-col">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">Balance: </span>
        <span className="space-x-2">
          <Loader loading={loading} inline>
            {balance}
          </Loader>
          <span className="text-bold">ETH</span>
        </span>
      </div>

      <EthersContext.Provider value={{ wallet: selectedWallet, provider }}>
        <TabPanel />
      </EthersContext.Provider>
    </section>
  );
};

export default TokenPage;
