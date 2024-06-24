import Web3Provider from "../providers/web3provider";

// @ts-ignore
window.openWallet = ({ message }: { message: string }): Promise => {
  console.debug("get message from page context", message);
  // window.postMessage({ type: "FROM_PAGE", payload: null }, "*");
  window.postMessage({ action: "OpenPopup", payload: null }, "*");

  return new Promise((res, rej) => {
    window.addEventListener("message", ({ data, origin, source }) => {
      console.debug("event props: ", data, origin, source);
      if (source != window) {
        console.debug("interrupt message send from self");
        return;
      }

      if (data.type && data.type == "FROM_CONNECT_PAGE") {
        const { payload: account } = data;
        if (account) {
          //TODO: this is just for quick fix, should not set private key as address
          res({
            name: account.name,
            wallet: { address: account.privateKey.slice(0, 10) },
          });
        } else {
          rej("No account get");
        }
        return;
      }
    });
  });
};

const provider = new Web3Provider();
window.getProvider = () => {
  return provider;
};

export {};
