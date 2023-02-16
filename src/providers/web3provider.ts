//The Provider API specification consists of a single method and five events.
// https://eips.ethereum.org/EIPS/eip-1193

enum Event {
  eth_accounts = "eth_accounts",
  eth_chainId = "eth_chainId",
}

type callback = (value: any) => void;
type handler = { res: callback; rej: callback };
export default class Web3Provider {
  listeners: { [key: string]: handler } = {};
  constructor() {
    console.log("web3provider--constructor", "should excute once");
    window.addEventListener("message", ({ data, source }) => {
      if (source != window) {
        console.debug("filter message send from self");
        return;
      }

      if (!data.type) {
        return;
      }

      console.log("web3provider--     response       ", data, source);
      this.emit(data.type, data);
    });
  }
  emit(type: string, data: any) {
    const { res, rej } = this.listeners[type];
    console.log("web3provider--type", type);
    switch (type) {
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
  }
  listen(type: string, handler: handler) {
    this.listeners[type] = handler;
  }
  request(request: { method: string; params?: any[] | undefined }) {
    console.log("web3provider--request", request);
    return new Promise<any>((res, rej) => {
      window.postMessage({ action: request.method, payload: request.params });
      this.listen(request.method, { res, rej });
    });
  }
  on() {
    console.log("web3provider--on");
  }
  removeListener() {
    console.log("web3provider--removeListener");
  }
}
