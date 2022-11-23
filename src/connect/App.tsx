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
    <div>
      request from:
      <div>
        <span>accounts name: {account?.name}</span>
        <span>accounts name: {account?.wallet.address}</span>
      </div>
      accounts: {}
      <div>
        <button>Cancel</button>
        <button>Agree</button>
      </div>
    </div>
  );
}

export default App;
