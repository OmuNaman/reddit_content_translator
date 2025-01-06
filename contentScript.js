chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    try {
      console.log("Translate action received in content script.");

      // Extract post title and content
      const postTitleElement = document.querySelector('h1._eYtD2XCVieq6emjKBH3m');
      const postContentElement = document.querySelector('div[data-test-id="post-content"]');
      
      const postTitle = postTitleElement ? postTitleElement.innerText : '[No Title]';
      const postContent = postContentElement ? postContentElement.innerText : '[No Content]';

      // Extract comments
      const commentElements = document.querySelectorAll('div[data-test-id="comment"]');
      const comments = [];
      commentElements.forEach((el) => {
        const author = el.querySelector('a[data-click-id="user"]')?.innerText || '[deleted]';
        const commentBody = el.querySelector('div[data-test-id="comment"]')?.innerText || '';
        comments.push({ author, commentBody });
      });

      console.log(`Extracted ${comments.length} comments.`);

      // Send data to background script for translation
      chrome.runtime.sendMessage(
        { action: "translateContent", data: { postTitle, postContent, comments } },
        (response) => {
          console.log("Received response from background script:", response);
          if (response.status === "Translation successful!" && response.translatedData) {
            // Update the page with translated content
            const { translatedPostTitle, translatedPostContent, translatedComments } = response.translatedData;

            // Replace post title
            if (postTitleElement) {
              postTitleElement.innerText = translatedPostTitle;
            }

            // Replace post content
            if (postContentElement) {
              postContentElement.innerText = translatedPostContent;
            }

            // Replace each comment
            commentElements.forEach((el, index) => {
              const commentBodyElement = el.querySelector('div[data-test-id="comment"]');
              if (commentBodyElement && translatedComments[index]) {
                commentBodyElement.innerText = translatedComments[index].commentBody;
              }
            });

            // Notify the user (optional)
            alert("Reddit post and comments have been translated to English!");

            // Send response back to popup
            sendResponse({ status: "Translation successful!" });
          } else {
            alert(response.status);
            sendResponse({ status: response.status });
          }
        }
      );
    } catch (error) {
      console.error("Error extracting content:", error);
      sendResponse({ status: "An error occurred while extracting content." });
    }

    return true; // Keep the message channel open for sendResponse
  }
});
