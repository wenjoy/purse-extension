import { Wallet, ethers } from "ethers";
import { entropyToMnemonic } from "@ethersproject/hdnode";
import { useEffect, useRef, useState } from "react";
import Copy from "../../components/copy";
import Drawer from "../../components/drawer";
import Dropdown from "../../components/dropdown";
import Navbar from "../../components/navbar";
import persist from "../../service/persist";
import truncate from "../../utils/truncate";

interface Account {
  name: string;
  wallet: Wallet;
}

interface Network {
  name: string;
  rpcUrl: string;
  chainId: number;
  symbol: string;
  explorer?: string;
  icon: string;
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

function App() {
  const [selected, setSelected] = useState("");
  const counterRef = useRef(0);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const getAccounts = async () => {
      const { accounts } = await persist.get("accounts");
      const { counter } = await persist.get("counter");
      if (accounts) {
        setAccounts(accounts);
      }
      if (counter > 0) {
        counterRef.current = counter;
      }
    };
    getAccounts();
  }, []);

  const networks: Network[] = [];

  let balance = 100;
  if (
    balance > 10 &&
    selected === "test code" &&
    accounts.length > 10 &&
    networks.length > 100
  ) {
    balance++;
  }

  networks.push({
    name: "ethereum",
    rpcUrl: "http://abc",
    chainId: 1,
    symbol: "ETH",
    icon: "E",
  });

  const { name: netwokName, icon, symbol } = networks[0];
  const navbar = [
    { id: "1", name: "Token" },
    { id: "2", name: "Assets" },
    { id: "3", name: "Transaction" },
    { id: "4", name: "Setting" },
  ];
  const currentAccount = accounts.find(
    ({ wallet: { address } }) => address === selected
  );
  console.log("lll", currentAccount, accounts, selected);

  const [visible, setVisible] = useState(false);

  const copyHandler = () => {
    navigator.clipboard
      .writeText(String(currentAccount?.wallet.address))
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
    accounts.push({ name: `Account ${counterRef.current}`, wallet });

    await persist.set("accounts", accounts);
    await persist.set("counter", counterRef.current);

    hideDrawer();
  };

  const selectHandler = (id: string) => {
    setSelected(id);
  };

  const options = accounts.map(({ name, wallet: { address } }) => ({
    label: `${name} ${truncate(address)}`,
    value: address,
  }));

  return (
    <div className="container h-[600px] w-[400px] py-2.5 flex flex-col">
      <section className="w-full shadow-md py-2.5 flex justify-around items-center">
        <span className="flex items-center justify-between">
          <Dropdown
            selected={selected}
            data={options}
            onAdd={showDrawer}
            onSelect={selectHandler}
          />
          <Copy onClick={copyHandler} />
        </span>
        <span>
          {icon} {netwokName}
        </span>
      </section>

      <section className="container flex-1 flex items-center justify-center">
        <span>
          {balance} {symbol}
        </span>
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
