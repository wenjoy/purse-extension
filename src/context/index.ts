import { NameWallet } from "../popup/App";
import { createContext } from "react";
import { providers } from "ethers";

const EthersContext = createContext<{
  wallet: NameWallet;
  provider: providers.BaseProvider;
}>({
  wallet: {} as NameWallet,
  provider: {} as providers.BaseProvider,
});

export { EthersContext };
