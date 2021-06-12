let flag = 0;

chrome.browserAction.onClicked.addListener(toggleShowKeys);

function toggleShowKeys(tab) {
  if (flag == 0) flag = 1;
  else if (flag == 1) flag = 0;

  let toggle = {
    message: "toggle",
    state: flag,
  };

  setIconNew(flag);

  chrome.tabs.sendMessage(tab.id, toggle);
}

function setIconNew(value) {
  if (value == 0)
    chrome.browserAction.setIcon({
      path: { 19: "showkeys_16.png", 38: "showkeys_32.png" },
    });
  else if (value == 1)
    chrome.browserAction.setIcon({
      path: { 19: "showkeys_blue_16.png", 38: "showkeys_blue_32.png" },
    });
}
