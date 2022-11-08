import { entropyToMnemonic } from "@ethersproject/hdnode";
import { ethers } from "ethers";
import { useState } from "react";
import Copy from "../../components/copy";
import Drawer from "../../components/drawer";
import Dropdown from "../../components/dropdown";
import Navbar from "../../components/navbar";

interface Account {
  name: string;
  address: string;
}

interface Network {
  name: string;
  rpcUrl: string;
  chainId: number;
  symbol: string;
  explorer?: string;
  icon: string;
}

function App() {
  const accounts: Account[] = [];
  const networks: Network[] = [];

  // TODO: jump to create wallet
  accounts.push({
    name: "Account1",
    address: "0x100000101",
  });

  const generateWallet = () => {
    const {
      utils: { randomBytes },
      Wallet: { fromMnemonic },
    } = ethers;
    const entropy = randomBytes(16);
    const mnemonic = entropyToMnemonic(entropy);
    const wallet = fromMnemonic(mnemonic);
    return wallet;
  };
  const wallet = generateWallet();
  console.log("debug", wallet);

  // for (let i = 0; i < wallet.length; i++) {
  //   const element = wallet[i];
  //   accounts.push({
  //     name: `Wallet ${i + 1}`,
  //     address: truncate(element.address),
  //   });
  // }

  const [selected, setSelected] = useState(accounts[0].address);

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
  const currentAccount = accounts.find(({ address }) => address === selected);
  const [visible, setVisible] = useState(false);

  const copyHandler = () => {
    navigator.clipboard
      .writeText(String(currentAccount!.address))
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

  const creatAccont = () => {
    hideDrawer();
  };

  const selectHandler = (id: string) => {
    setSelected(id);
  };

  const options = accounts.map(({ name, address }) => ({
    label: name,
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
