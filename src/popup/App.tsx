import { EthersContext } from "../context";
import { Wallet, ethers, utils } from "ethers";
import { entropyToMnemonic } from "@ethersproject/hdnode";
import { useEffect, useRef, useState } from "react";
import Copy from "../components/copy";
import Drawer from "../components/drawer";
import Dropdown from "../components/dropdown";
import Loader from "../components/loader";
import Navbar from "../components/navbar";
import TabPanel from "../components/tabpanel";
import logger from "../service/logger";
import persist from "../service/persist";
import truncate from "../utils/truncate";
import useBalance from "../hooks/useBalance";

export interface Purse {
  name: string;
  wallet: Wallet;
}

interface Network {
  name: string;
  rpcUrl?: string;
  chainId?: number;
  symbol?: string;
  explorer?: string;
  icon?: string;
}

const generateMnemonic = () => {
  const {
    utils: { randomBytes },
  } = ethers;
  const entropy = randomBytes(16);
  const mnemonic = entropyToMnemonic(entropy);
  return mnemonic;
};

const generateWallet = (mnemonic: string, path?: string) => {
  const {
    Wallet: { fromMnemonic },
  } = ethers;
  const wallet = fromMnemonic(mnemonic, path);
  return wallet;
};

const getMnemonic = async () => {
  const { mnemonic } = await persist.get("mnemonic");
  if (mnemonic) {
    return mnemonic;
  } else {
    const newMnemonic = generateMnemonic();
    await persist.set("mnemonic", newMnemonic);
    return newMnemonic;
  }
};

const isValidAddress = (address: string) => {
  if (address.length > 0) {
    return true;
  } else {
    logger.info("logger: invalid address %s", address);
    return false;
  }
};

const getNetworks = () => {
  const networks = [
    { name: "homestead" },
    { name: "goerli" },
    { name: "matic" },
    { name: "arbitrum" },
    { name: "optimism" },
  ];
  return networks;
};

function App() {
  const [provider, setProvider] = useState<any>();
  const [selected, setSelected] = useState("");
  const [accounts, setAccounts] = useState<Purse[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [visible, setVisible] = useState(false);
  const counterRef = useRef(0);

  console.info({ name: "test" });

  const networks: Network[] = getNetworks();

  const networksOptions = networks.map(({ name }) => ({
    label: name,
    value: name,
  }));
  const accountsOptions = accounts.map(({ name, wallet: { address } }) => ({
    label: `${name} ${truncate(address)}`,
    value: address,
  }));

  useEffect(() => {
    const getAccounts = async () => {
      const { accounts } = await persist.get("accounts");
      const { counter } = await persist.get("counter");
      if (accounts) {
        setAccounts(accounts);
        setSelected(accounts[0].wallet.address);
      }
      if (counter > 0) {
        counterRef.current = counter;
      }
    };
    getAccounts();
  }, []);

  useEffect(() => {
    // For debug with ethers API
    console.log("logger: ethers ", ethers);
  }, []);

  useEffect(() => {
    if (selectedNetwork === "") {
      setSelectedNetwork(networks[0].name);
    } else {
      const provider = ethers.getDefaultProvider(selectedNetwork, {
        alchemy: "v52XdAeZ58ftv3xmWNbqao3k5F1Y_E3V",
      });
      setProvider(provider);
    }
  }, [selectedNetwork]);

  // const provider = new ethers.providers.JsonRpcProvider();

  const requestBalance = async (selected: Address, provider: any) => {
    let balance = "";

    if (isValidAddress(selected) && provider) {
      const value = await provider.getBalance(selected);
      balance = utils.formatEther(value);
    }
    return balance;
  };
  const { balance, loading } = useBalance(
    [selected, provider],
    (address: Address) => requestBalance(address, provider)
  );

  const navbar = [
    { id: "1", name: "Token" },
    { id: "2", name: "Assets" },
    { id: "3", name: "Transaction" },
    { id: "4", name: "Setting" },
  ];

  const purse = accounts.find(
    ({ wallet: { address } }) => address === selected
  ) as Purse;

  const copyHandler = () => {
    navigator.clipboard
      .writeText(String(purse?.wallet.address))
      .then(() => {
        alert("Copied");
      })
      .catch(() => {
        alert("Copy failed");
      });
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
  };

  const creatAccont = async () => {
    const mnemonic = await getMnemonic();
    const path = `m/44'/60'/0'/0/${counterRef.current++}`;
    const wallet = generateWallet(mnemonic as string, path);
    console.log("debug", wallet);

    accounts.push({ name: `Account ${counterRef.current}`, wallet });

    await persist.set("accounts", accounts);
    await persist.set("counter", counterRef.current);

    hideDrawer();
  };

  const selectHandler = (address: string) => {
    setSelected(address);
  };

  return (
    <div className="panel">
      <section className="w-full shadow-md py-2.5 flex justify-around items-center">
        <span className="flex items-center justify-between">
          <Dropdown
            selected={selected}
            data={accountsOptions}
            onAdd={showDrawer}
            onSelect={selectHandler}
          />
          <Copy onClick={copyHandler} />
        </span>
        <span>
          <Dropdown
            selected={selectedNetwork}
            data={networksOptions}
            onSelect={setSelectedNetwork}
          />
        </span>
      </section>

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

        <EthersContext.Provider value={{ purse, provider }}>
          <TabPanel />
        </EthersContext.Provider>
      </section>

      <section className="w-full flex justify-around">
        {navbar.map(({ name, id }) => (
          <span key={id}>
            <Navbar name={name} />
          </span>
        ))}
      </section>

      <Drawer visible={visible} onClose={hideDrawer}>
        <button className="btn" onClick={creatAccont}>
          Create a new account
        </button>
        <button className="btn">Import from private key</button>
      </Drawer>
    </div>
  );
}

export default App;
