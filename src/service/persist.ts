const set = (key: string, val: any) => {
  return new Promise((res) => {
    if (chrome.storage) {
      chrome.storage.local.set({ [key]: val }, () => {
        res(true);
      });
    } else {
      localStorage.setItem(key, JSON.stringify({ [key]: val }));
      res(true);
    }
  });
};

const get: (key: string) => Promise<any> = (key) => {
  return new Promise((res) => {
    const emptyValidJSONString = "{}";
    if (chrome.storage) {
      chrome.storage.local.get(key, (result: { key: string; value: any }) => {
        res(result);
      });
    } else {
      res(JSON.parse(localStorage.getItem(key) ?? emptyValidJSONString));
    }
  });
};

export default {
  set,
  get,
};
