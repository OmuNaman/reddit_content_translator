document.getElementById('translateBtn').addEventListener('click', () => {
  document.getElementById('status').innerText = "Translating...";
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "translate" }, (response) => {
      if (response && response.status) {
        document.getElementById('status').innerText = response.status;
      } else {
        document.getElementById('status').innerText = "No response from content script.";
      }
    });
  });
});
