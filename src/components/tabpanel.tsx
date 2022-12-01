import { BigNumber, utils } from "ethers";
import { EthersContext } from "../context";
import { useContext, useRef, useState } from "react";
import Modal from "./modal";

type Transaction = {
  from: string;
  to: string;
  value: BigNumber;
  nonce: number;
  gasLimit: string;
  gasPrice: BigNumber;
};
type Contract = {
  hash: string;
};
const Send = () => {
  const [reciever, setReciever] = useState("");
  const [amount, setAmount] = useState("0");
  const [showModal, setShowModal] = useState(false);
  const txRef = useRef<Transaction>({} as Transaction);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [transaction, setTransaction] = useState<Contract>({} as Contract);
  const [error, setError] = useState<Error>();
  const confirmHandler = async () => {
    const signer = wallet.connect(provider);
    try {
      setSending(true);
      const transaction = await signer.sendTransaction(txRef.current);
      console.debug(transaction);
      setTransaction(transaction);
    } catch (err: any) {
      setError(err);
      console.error(err);
    }
    setSending(false);
    setShowModal(false);
  };
  const closeHandler = () => {
    setShowModal(false);
  };

  const {
    wallet: { wallet },
    provider,
  } = useContext(EthersContext);
  const sender = wallet.address;

  const startTransaction = async () => {
    if (loading) return;
    setLoading(true);
    const gasPrice = await provider.getGasPrice();
    const tx = {
      from: sender,
      to: reciever,
      value: utils.parseEther(amount ?? "0"),
      nonce: await provider.getTransactionCount(sender, "latest"),
      gasLimit: utils.hexlify(100000),
      gasPrice,
    };
    txRef.current = tx;
    setLoading(false);
    setShowModal(true);
  };

  const tx = txRef.current;
  const content = tx.gasPrice
    ? [
        `from: ${tx.from}`,
        `to: ${tx.to}`,
        `amount: ${tx.value?.toString()}`,
        `gas limit: ${parseInt(tx.gasLimit, 16)}`,
        `gas price: ${utils.formatEther(tx.gasPrice)} ETH`,
        sending ? "transaction is processing" : "",
      ]
    : [];

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
      <button
        className="btn-purple"
        onClick={startTransaction}
        disabled={loading}
      >
        {loading ? "..." : "Start Transaction"}
      </button>
      {transaction.hash && (
        <p className="h-24 break-all overflow-auto">
          Transaction is finished at {transaction.hash}
        </p>
      )}
      {error?.message && (
        <p className="h-24 break-all overflow-auto">
          Transaction is failed, error message {error.message}
        </p>
      )}
      <Modal
        visible={showModal}
        content={content}
        onClose={closeHandler}
        onConfirm={confirmHandler}
      />
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
