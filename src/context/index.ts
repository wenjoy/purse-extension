import { NameWallet } from "../popup/App";
import { Provider, createContext } from "react";

const EthersContext = createContext<{
  wallet: NameWallet;
  provider: Provider<any>;
}>({
  wallet: {} as NameWallet,
  provider: {} as Provider<any>,
});

export { EthersContext };
