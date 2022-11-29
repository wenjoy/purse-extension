const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
s.onload = function () {
  s.remove();
};
(document.head || document.documentElement).appendChild(s);

// var port = chrome.runtime.connect();

window.addEventListener(
  "message",
  async (event) => {
    console.debug("receive message from page context: ", event);

    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type == "FROM_PAGE") {
      const { payload } = event.data;
      // port.postMessage(event.data.text);
      const body = { action: "OpenPopup", payload };
      const result = await chrome.runtime.sendMessage(JSON.stringify(body));
      console.debug("result", result);
    }

    if (event.data.type && event.data.type == "FROM_POPUP") {
      const { payload } = event.data;
      // port.postMessage(event.data.text);
      console.debug("result from popup: ", payload);
    }
  },
  false
);

chrome.runtime.onMessage.addListener(
  (request: any, sender: any, sendResponse: any) => {
    console.debug("content recieve message: ", request, sender, sendResponse);

    console.debug(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );
    window.postMessage(request, "*");
  }
);

export {};
