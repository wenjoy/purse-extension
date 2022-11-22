declare let chrome: {
  storage: {
    local: {
      set: (key: { [k: string]: any }, callback: () => void) => void;
      get: (
        key: string,
        callback: (result: { key: string; value: any }) => void
      ) => void;
    };
  };
  windows: any;
  runtime: any;
};
