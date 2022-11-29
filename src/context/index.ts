import { Provider, createContext } from "react";
import { Purse } from "../popup/App";

const EthersContext = createContext<{ purse: Purse; provider: Provider<any> }>({
  purse: {} as Purse,
  provider: {} as Provider<any>,
});

export { EthersContext };
