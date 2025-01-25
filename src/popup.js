document.getElementById('save').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!apiKey) {
      alert('Please enter an API key!');
      return;
    }
  
    try {
      // Test the API key immediately
      const testAI = new googleGenerativeAI.GoogleGenerativeAI(apiKey);
      const testModel = testAI.getGenerativeModel({ model: "gemini-pro" });
      await testModel.generateContent('Test');
      
      // Save if valid
      await chrome.storage.local.set({ geminiApiKey: apiKey });
      alert('✅ API key saved! Refresh Reddit pages to use');
      window.close();
    } catch (error) {
      console.error('API key validation failed:', error);
      alert('❌ Invalid API key! Check console for details');
    }
  });
  
  // Load existing key
  chrome.storage.local.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      document.getElementById('apiKey').value = result.geminiApiKey;
    }
  });