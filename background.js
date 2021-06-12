let flag = 0;

chrome.browserAction.onClicked.addListener(toggleShowKeys);

function toggleShowKeys(tab) {
  if (flag == 0) flag = 1;
  else if (flag == 1) flag = 0;

  let toggle = {
    message: "toggle",
    state: flag,
  };

  chrome.tabs.sendMessage(tab.id, toggle);
}
