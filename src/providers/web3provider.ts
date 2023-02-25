//The Provider API specification consists of a single method and five events.
// https://eips.ethereum.org/EIPS/eip-1193

// export enum Event {
// this will cause syntax error: Uncaught SyntaxError: Cannot use import statement outside a module
enum Event {
  eth_accounts = "eth_accounts",
  eth_chainId = "eth_chainId",
  eth_call = "eth_call",
  eth_blockNumber = "eth_blockNumber",
  eth_estimateGas = "eth_estimateGas",
  eth_sendTransaction = "eth_sendTransaction",
  eth_getTransactionByHash = "eth_getTransactionByHash",
  eth_getTransactionReceipt = "eth_getTransactionReceipt",
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
  emit(type: string, params: any) {
    console.log("web3provider--log", "response", type, params);
    const { res, rej } = this.listeners[type];
    switch (type) {
      case Event.eth_accounts: {
        console.log("web3provider-39-account", params);
        const account = params.payload?.address;
        if (account) {
          res([account]);
        } else {
          rej("Get account error");
        }
        break;
      }
      case Event.eth_chainId: {
        const chainId = params.payload;
        if (chainId) {
          console.log("web3provider--log", "chainId", chainId);
          res(chainId);
        } else {
          rej("Get chainId error");
        }
        break;
      }
      case Event.eth_call: {
        const result = params.payload;
        console.log("web3provider-55", result);
        if (result) {
          res(result);
        } else {
          rej("eth contract error");
        }
        break;
      }
      case Event.eth_blockNumber: {
        const blockNumber = params.payload;
        console.log("web3provider-65-blockNumber", blockNumber);
        if (blockNumber) {
          res(blockNumber);
        } else {
          rej("get blockNumber error");
        }
        break;
      }
      case Event.eth_estimateGas: {
        const gas = params.payload;
        console.log("web3provider-65-gas", gas);
        if (gas) {
          res(gas);
        } else {
          rej("get blockNumber error");
        }
        break;
      }
      case Event.eth_sendTransaction: {
        const result: any = params.payload;
        console.log("web3provider-89-result", result);
        if (result) {
          res(result);
        } else {
          rej("send transaction error");
        }
        break;
      }
      case Event.eth_getTransactionByHash: {
        const result: any = params.payload;
        console.log("web3provider-100-params", params);
        if (result) {
          res(result);
        } else {
          rej("send transaction error");
        }
        break;
      }
      case Event.eth_getTransactionReceipt: {
        const result: any = params.payload;
        if (result) {
          res(result);
        } else {
          rej("get transaction receipt error");
        }
        break;
      }
    }
  }
  listen(type: string, handler: handler) {
    this.listeners[type] = handler;
  }
  request(request: { method: string; params?: any[] | undefined }) {
    console.log("web3provider--log", request);
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
