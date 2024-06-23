import { Action } from "../scripts/background";
import { Provider } from "../context";
import { Wallet, ethers } from "ethers";
import { entropyToMnemonic } from "@ethersproject/hdnode";
import { useEffect, useRef, useState } from "react";
import Copy from "../components/copy";
import Drawer from "../components/drawer";
import Dropdown from "../components/dropdown";
import NavbarPanel from "../components/navbar-panel";
import TokenPage from "../components/token-page";
import TransactionPage from "../components/transaction-page";
import persist from "../service/persist";
import truncate from "../utils/truncate";

export interface NameWallet {
  name: string;
  wallet: Wallet;
}

export interface DehydratedWallet {
  name: string;
  privateKey: string;
}

interface Network {
  name: string;
  value: string;
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

const getNetworks = () => {
  const networks = [
    { value: "homestead", name: "homestead" },
    { value: "goerli", name: "goerli" },
    { value: "matic", name: "matic" },
    { value: "arbitrum", name: "arbitrum" },
    { value: "optimism", name: "optimism" },
    { value: "http://localhost:8545", name: "localhost" },
  ];
  return networks;
};

function App() {
  const [provider, setProvider] = useState<Provider>({} as Provider);
  const [selectedWalletAddress, setSelectedWalletAddress] = useState("");
  const [wallets, setWallets] = useState<NameWallet[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [visible, setVisible] = useState(false);
  const counterRef = useRef(0);
  const [privateKey, setPrivateKey] = useState<string>("");

  window.provider = provider;

  const networks: Network[] = getNetworks();

  const networksOptions = networks.map(({ name, value }) => ({
    label: name,
    value,
  }));
  const walletsOptions = wallets.map(({ name, wallet: { address } }) => ({
    label: `${name} ${truncate(address)}`,
    value: address,
  }));

  //NOTE: should wrapper this with a named hooks, now I can't tell what this is doing easily
  useEffect(() => {
    const recoverWalletsFromStore = async () => {
      const { wallets } = await persist.get("wallets");
      const { counter } = await persist.get("counter");
      if (wallets) {
        const rehydratedWallets = wallets.map(
          ({ name, privateKey }: DehydratedWallet) => ({
            name,
            wallet: new ethers.Wallet(privateKey),
          })
        );
        setWallets(rehydratedWallets);
        setSelectedWalletAddress(rehydratedWallets[0].wallet.address);
      }
      if (counter > 0) {
        counterRef.current = counter;
      }
    };
    recoverWalletsFromStore();
  }, []);

  useEffect(() => {
    // For debug with ethers API
    console.debug("logger: ethers ", ethers);
  }, []);

  useEffect(() => {
    if (selectedNetwork === "") {
      setSelectedNetwork(networks[0].value);
    } else {
      const provider = ethers.getDefaultProvider(selectedNetwork, {
        //TODO: keep api key in a safe place
        alchemy: "YA4l5t9NnZlEYLOF0MqW5Dtmn8xKUOAo",
        etherscan: "C4YT7SIA975H8SYVH51W42MUQG1NENZ2HF",
      });
      setProvider(provider);
    }
  }, [selectedNetwork]);

  useEffect(() => {
    persistNetwork();
    async function persistNetwork() {
      try {
        if (!provider.getNetwork) {
          return;
        }

        const network = await provider.getNetwork();
        persist.set("selectedNetwork", network);
      } catch (err) {
        console.error(err);
      }
    }
  }, [provider]);

  const selectedWallet = wallets.find(
    ({ wallet: { address } }) => address === selectedWalletAddress
  ) as NameWallet;

  useEffect(() => {
    console.log("App-156-selectedWallet", selectedWallet);
    if (!selectedWallet?.wallet) {
      return;
    }

    chrome.runtime.sendMessage({
      action: Action.set_wallet_privateKey,
      payload: selectedWallet.wallet.privateKey,
    });
  }, [selectedWallet]);

  const copyHandler = () => {
    navigator.clipboard
      .writeText(String(selectedWallet?.wallet.address))
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
    //NOTE: BIP-39
    const path = `m/44'/60'/0'/0/${counterRef.current++}`;
    const wallet = generateWallet(mnemonic as string, path);

    wallets.push({ name: `Account ${counterRef.current}`, wallet });
    const dehydratedWallets: DehydratedWallet[] = wallets.map(
      ({ name, wallet }) => ({ name, privateKey: wallet.privateKey })
    );

    await persist.set("wallets", dehydratedWallets);
    await persist.set("counter", counterRef.current);

    hideDrawer();
  };

  const importAccount = async () => {
    const trimmedPrivateKey = privateKey.trim();
    if (!trimmedPrivateKey) {
      alert("private key cann't be empty");
    }

    const wallet = new ethers.Wallet(trimmedPrivateKey);
    wallets.push({ name: "imported", wallet });
    const dehydratedWallets: DehydratedWallet[] = wallets.map(
      ({ name, wallet }) => ({ name, privateKey: wallet.privateKey })
    );
    await persist.set("wallets", dehydratedWallets);
    //TODO: persist
    hideDrawer();
  };

  const selectHandler = (address: string) => {
    setSelectedWalletAddress(address);
  };

  const navbar = [
    {
      name: "Token",
      page: <TokenPage {...{ provider, selectedWallet }} />,
    },
    {
      name: "Transaction",
      page: (
        <TransactionPage {...{ provider, selectedWallet, selectedNetwork }} />
      ),
    },
    { name: "Assets", page: <></> },
    { name: "Setting", page: <></> },
  ];

  return (
    <div className="panel relative">
      <section className="w-full shadow-md py-2.5 flex justify-around items-center">
        <span className="flex items-center justify-between">
          <Dropdown
            selected={selectedWalletAddress}
            data={walletsOptions}
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

      <NavbarPanel {...{ navbar }} />

      <Drawer visible={visible} onClose={hideDrawer}>
        <div>
          <button className="btn" onClick={creatAccont}>
            Create a new account
          </button>
        </div>
        <div>
          <input
            className="p-2 border-solid border"
            onChange={(e) => {
              setPrivateKey(e.target.value);
            }}
          />
          <button className="btn" onClick={importAccount}>
            Import from private key
          </button>
        </div>
      </Drawer>
    </div>
  );
}

export default App;
