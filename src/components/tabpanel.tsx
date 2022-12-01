import { EthersContext } from "../context";
import { useContext, useState } from "react";
import { utils } from "ethers";

const Send = () => {
  const [reciever, setReciever] = useState("");
  const [amount, setAmount] = useState("0");
  const {
    wallet: { wallet },
    provider,
  } = useContext(EthersContext);
  const sender = wallet.address;

  const confirmHandler = async () => {
    const gasPrice = await provider.getGasPrice();
    const tx = {
      from: sender,
      to: reciever,
      value: utils.parseEther(amount ?? "0"),
      nonce: provider.getTransactionCount(sender, "latest"),
      gasLimit: utils.hexlify(100000),
      gasPrice,
    };
    const signer = wallet.connect(provider);

    try {
      const transaction = signer.sendTransaction(tx);
      console.debug(transaction);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="space-1 flex flex-col justify-around space-y-2 mt-10">
      <div className="flex flex-col space-y-2">
        <label htmlFor="address">Address: </label>
        <input
          className="outline p-1 rounded-md"
          id="address"
          onChange={(e) => setReciever(e.target.value)}
          value={reciever}
        />
        <label htmlFor="amount">Amount(ETH): </label>
        <input
          className="outline p-1 rounded-md"
          id="amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </div>
      <button className="btn-purple" onClick={confirmHandler}>
        Confirm
      </button>
    </div>
  );
};

const TabPanel = () => {
  const [current, setCurrent] = useState("");
  const tabs = ["Buy", "Send", "Swap"];
  const setTab = (tab: string) => {
    setCurrent(tab);
  };
  const render = () => {
    switch (current) {
      case "Buy":
        return "Buy";
      case "Send":
        return <Send />;
      case "Swap":
        return "Swap";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <button key={tab} className="btn" onClick={() => setTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="cotainer">{render()}</div>
    </div>
  );
};

export default TabPanel;
