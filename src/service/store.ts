import persist from "./persist";

enum Key {
  selected_account,
  selected_network,
}

type Data = Record<Key, any>;

function persistKey() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalSet = descriptor.set;
    descriptor.set = (value: any) => {
      persist.set(propertyKey, value);
      originalSet?.(value);
    };
    const originalGet = descriptor.get;
    descriptor.get = () => {
      return originalGet?.() ?? persist.get(propertyKey);
    };
  };
}

class Store {
  private data: Data;
  constructor() {
    this.data = {} as Data;
  }

  @persistKey()
  set selectedAccount(value: any) {
    this.data[Key.selected_account] = value;
  }

  get selectedAccount() {
    return this.data[Key.selected_account];
  }

  @persistKey()
  set selectedNetwork(value: any) {
    this.data[Key.selected_network] = value;
  }

  get selectedNetwork() {
    return this.data[Key.selected_network];
  }
}
export default Store;
