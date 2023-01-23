function injectScript() {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("inject.js");
  s.onload = function () {
    s.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

function startMessageMiddleware() {
  window.addEventListener(
    "message",
    async (event) => {
      // We only accept messages from ourselves
      if (event.source != window) {
        return;
      }

      try {
        const result = await chrome.runtime.sendMessage(event.data);
        console.debug("Send message result", result);
      } catch (error) {
        console.error("Send message to extension error: ", error);
      }

      // TODO: fix this for open popup
      // if (event.data.type && event.data.type == "FROM_PAGE") {
      //   const { payload } = event.data;
      //   // port.postMessage(event.data.text);
      //   const body = { action: "OpenPopup", payload };
      //   const result = await chrome.runtime.sendMessage(JSON.stringify(body));
      //   console.debug("result", result);
      // }

      // if (event.data.type && event.data.type == "FROM_POPUP") {
      //   const { payload } = event.data;
      //   // port.postMessage(event.data.text);
      //   console.debug("result from popup: ", payload);
      // }

      // if (event.data.method) {
      //   await chrome.runtime.sendMessage({
      //     action: event.data.method,
      //     payload: event.data.params,
      //   });
      // }
    },
    false
  );

  chrome.runtime.onMessage.addListener(
    (request: any, sender: any, sendResponse: any) => {
      console.debug(
        "Extension send back message detail(request, sender, sendResponse):",
        request,
        sender,
        sendResponse
      );

      window.postMessage(request, "*");
    }
  );
}

injectScript();
startMessageMiddleware();

export {};
