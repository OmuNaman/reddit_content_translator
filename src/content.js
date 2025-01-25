// Style for translated content
const translationStyle = {
    borderLeft: '3px solid #FF5700',
    paddingLeft: '10px',
    margin: '5px 0',
    fontStyle: 'italic',
    color: '#d7dadc'
  };
  
  // Track translated elements
  const translatedElements = new WeakSet();
  
  function markAsTranslated(element) {
    translatedElements.add(element);
    element.style.opacity = '0.8';
    element.style.transition = 'opacity 0.3s ease';
  }
  
  async function translateAndReplace(element) {
    try {
      const originalText = element.textContent;
      
      // Show loading state
      element.innerHTML = `
        <div style="color: #818384; font-size: 0.9em">
          <div style="display:flex; align-items:center; gap:5px">
            <div class="spinner"></div>
            Translating...
          </div>
        </div>
      `;
  
      // Send translation request
      const translation = await chrome.runtime.sendMessage({
        action: 'translate',
        text: originalText
      });
  
      // Update with translated content
      if (translation?.text) {
        element.innerHTML = `
          <div style="${Object.entries(translationStyle).map(([k,v]) => `${k}:${v}`).join(';')}">
            ${translation.text}
            <div style="font-size:0.8em; color:#818384; margin-top:5px">
              [Translated from original]
            </div>
          </div>
        `;
        markAsTranslated(element);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      element.textContent = originalText;
    }
  }
  
  // Mutation observer for dynamic content
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // ELEMENT_NODE
          const targets = node.querySelectorAll?.('[data-test-id="post-content"], [data-testid="comment"]') || [];
          targets.forEach(element => {
            if (!translatedElements.has(element)) {
              translateAndReplace(element);
            }
          });
        }
      });
    });
  });
  
  // Start observing when Reddit loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }