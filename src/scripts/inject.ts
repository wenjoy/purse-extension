import Web3Provider from "../providers/web3provider";

// @ts-ignore
window.openWallet = ({ message }: { message: string }): Promise => {
  console.debug("get message from page context", message);
  window.postMessage({ type: "FROM_PAGE", payload: null }, "*");

  return new Promise((res, rej) => {
    window.addEventListener("message", ({ data, origin, source }) => {
      console.debug("event props: ", data, origin, source);
      if (source != window) {
        return;
      }

      if (data.type && data.type == "FROM_POPUP") {
        const { payload: account } = data;
        if (account) {
          res({ account });
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
