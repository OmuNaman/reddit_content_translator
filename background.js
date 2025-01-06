chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translateContent") {
    const { postTitle, postContent, comments } = request.data;

    // Send POST request to backend server with structured data
    fetch('http://localhost:3000/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postTitle, postContent, comments })
    })
    .then(response => response.json())
    .then(data => {
      if (data.translatedPostTitle && data.translatedPostContent && data.translatedComments) {
        // Send translated data back to content script
        sendResponse({ 
          status: "Translation successful!", 
          translatedData: data 
        });
      } else {
        sendResponse({ status: "Translation failed." });
      }
    })
    .catch(error => {
      console.error("Error:", error);
      sendResponse({ status: "An error occurred during translation." });
    });

    return true; // Keep the message channel open for sendResponse
  }
});
