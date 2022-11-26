import { useEffect, useState } from "react";
import persist from "../service/persist";

function App() {
  const [accounts, setAccounts] = useState<any>([]);
  const origin = new URLSearchParams(location.search).get("origin");

  useEffect(() => {
    async function main() {
      const { accounts } = await persist.get("accounts");
      setAccounts(accounts ?? []);
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
            payload: account,
          },
          function (response: any) {
            console.log("res: ", response);
            window.close();
          }
        );
      }
    );
  };

  const account = accounts[0];

  return (
    <div className="panel">
      <section>
        <p className="text-base">request from: {origin} </p>
      </section>
      <section>
        <h1 className="text-lg"> Accounts </h1>
        <span>
          {account?.name} : {account?.wallet.address}
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
