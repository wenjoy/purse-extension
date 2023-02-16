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
    window.addEventListener("message", ({ data, source }) => {
      if (source != window) {
        console.debug("filter message send from self");
        return;
      }

      if (!data.type) {
        return;
      }

      this.emit(data.type, data);
    });
  }
  emit(type: string, data: any) {
    const { res, rej } = this.listeners[type];
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
    return new Promise<any>((res, rej) => {
      window.postMessage({ action: request.method, payload: request.params });
      this.listen(request.method, { res, rej });
    });
  }
  on() {
    // TODO: Specifician required interface, implement later
    console.debug("web3provider--on");
  }
  removeListener() {
    // TODO: Specifician required interface, implement later
    console.debug("web3provider--removeListener");
  }
}
