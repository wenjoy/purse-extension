import { NameWallet } from "../popup/App";
import { createContext } from "react";
import { ethers } from "ethers";

export type Provider = ethers.providers.Provider;
const EthersContext = createContext<{
  wallet: NameWallet;
  provider: Provider;
}>({
  wallet: {} as NameWallet,
  provider: {} as Provider,
});

export { EthersContext };
