// Listen for a connection from the content script
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (request) => {
        // Check for the "ping" message
        if (request.message === "ping") {
            // Send back a "pong" message
            port.postMessage({ message: "pong" });
        } else {
            // Handle your original message here
            try {
                const youtubeName = request.youtubeName;
                console.log(youtubeName);
                const response = await fetch(
                    `https://e3qo0ohe2c.execute-api.us-west-1.amazonaws.com/Prod/youtube-donations/${youtubeName}`
                );
                const data = await response.json();
                console.log(data);
                const parsedBody = JSON.parse(data.body);
                console.log(parsedBody);
                const ethereumAddress = parsedBody.ethereumAddress;
                console.log(ethereumAddress);
                // Send a message back to the content script
                port.postMessage({ ethereumAddress });
            } catch (error) {
                console.error(error);
            }
        }
    });
});
