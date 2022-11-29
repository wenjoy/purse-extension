import { EthersContext } from "../context";
import { useContext, useState } from "react";

const Send = () => {
  const [address, setAddress] = useState("");
  const ethers = useContext(EthersContext);
  console.log("purse", ethers);

  const confirmHandler = () => {
    alert(address);
  };
  return (
    <div className="space-1 flex justify-around mt-10">
      <div className="flex flex-col space-y-2">
        <label htmlFor="address">Address: </label>
        <input
          className="outline p-1 rounded-md"
          id="address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
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
