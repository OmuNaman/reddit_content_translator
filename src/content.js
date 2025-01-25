async function translateElement(element) {
  const originalText = element.textContent;
  element.innerHTML = `<i style="color: #666">Translating...</i>`;
  
  const translation = await chrome.runtime.sendMessage({
    action: 'translate',
    text: originalText
  });
  
  if (translation?.text) {
    element.innerHTML = `<span style="border-left: 3px solid #ff4500; padding-left: 8px">
      ${translation.text}<br>
      <small style="color: #666">Translated from original</small>
    </span>`;
  }
}

function observeComments() {
  const observer = new MutationObserver((mutations) => {
    document.querySelectorAll('[data-test-id="post-content"], [data-testid="comment"]').forEach(element => {
      if (!element.dataset.translated) {
        element.dataset.translated = true;
        translateElement(element);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeComments);
} else {
  observeComments();
}