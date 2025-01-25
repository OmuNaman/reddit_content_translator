document.getElementById('save').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
    alert('API key saved! Reload Reddit page');
  });
});