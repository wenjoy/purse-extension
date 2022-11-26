import { useEffect, useState } from "react";
import persist from "../service/persist";

function App() {
  const [accounts, setAccounts] = useState<any>([]);
  console.log("ddd", accounts);

  useEffect(() => {
    async function main() {
      const { accounts } = await persist.get("accounts");
      setAccounts(accounts ?? []);
    }
    main();
  }, []);

  const account = accounts[0];

  return (
    <div className="panel">
      <section>
        <p className="text-base">request from:</p>
      </section>
      <section>
        <h1 className="text-lg"> Accounts </h1>
        <span>
          {account?.name} : {account?.wallet.address}
        </span>
      </section>
      <section className="space-x-5 justify-center flex mt-5">
        <button className="btn-dark">Cancel</button>
        <button className="btn">Agree</button>
      </section>
    </div>
  );
}

export default App;
