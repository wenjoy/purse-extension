//The Provider API specification consists of a single method and five events.
// https://eips.ethereum.org/EIPS/eip-1193

enum Event {
  eth_accounts = "eth_accounts",
  eth_chainId = "eth_chainId",
}

export default class Web3Provider {
  request(request: { method: string; params?: any[] | undefined }) {
    console.log("web3provider--request", request);
    return new Promise<any>((res, rej) => {
      window.postMessage(request);

      window.addEventListener("message", ({ data, origin, source }) => {
        console.log("web3provider--", data, origin, source);
        switch (data.type) {
          case Event.eth_accounts: {
            const account = data.payload?.wallet?.address;
            if (account) {
              res([account]);
            } else {
              rej("Get account error");
            }
            break;
          }
          case Event.eth_chainId: {
            const chainId = data.payload?.chainId;
            if (chainId) {
              res(chainId);
            } else {
              rej("Get chainId error");
            }
            break;
          }
        }
      });
    });
  }
  on() {
    console.log("web3provider--on");
  }
  removeListener() {
    console.log("web3provider--removeListener");
  }
}
