import { useEffect, useState } from "react";
import persist from "../service/persist";

function App() {
  const [wallets, setWallets] = useState<any>([]);
  const origin = new URLSearchParams(location.search).get("origin");

  useEffect(() => {
    async function main() {
      const { wallets } = await persist.get("wallets");
      setWallets(wallets ?? []);
    }
    main();
  }, []);

  const cancelHandler = () => {
    console.log("cancel");
    chrome.tabs.query(
      { active: true, currentWindow: false },
      function (tabs: any) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: "FROM_POPUP",
            payload: null,
          },
          function (response: any) {
            console.log(response);
            window.close();
          }
        );
      }
    );
  };

  const okHandler = () => {
    console.log("Agree");

    chrome.tabs.query(
      { active: true, currentWindow: false },
      function (tabs: any) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: "FROM_POPUP",
            payload: wallet,
          },
          function (response: any) {
            console.log("res: ", response);
            window.close();
          }
        );
      }
    );
  };

  const wallet = wallets[0];

  return (
    <div className="panel">
      <section>
        <p className="text-base">request from: {origin} </p>
      </section>
      <section>
        <h1 className="text-lg"> Accounts </h1>
        <span>
          {wallet?.name} : {wallet?.privateKey.slice(0, 10)}...
        </span>
      </section>
      <section className="space-x-5 justify-center flex mt-5">
        <button className="btn-dark" onClick={cancelHandler}>
          Cancel
        </button>
        <button className="btn" onClick={okHandler}>
          Agree
        </button>
      </section>
    </div>
  );
}

export default App;
