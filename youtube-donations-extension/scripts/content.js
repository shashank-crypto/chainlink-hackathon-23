console.log("Content script is running...");

const targetString = `This video accepts donations through youtube-donate`;

// Utility function to find the target video description element containing the target string
function findTargetVideoDescriptionElement(targetString) {
    const descriptionElements = Array.from(
        document.querySelectorAll(
            "yt-formatted-string, span.yt-simple-endpoint.style-scope.yt-formatted-string"
        )
    );
    return descriptionElements.find((element) => element.textContent.includes(targetString));
}

function getYoutubeUsername() {
    const usernameElement = document.querySelector(
        "a.yt-simple-endpoint.style-scope.yt-formatted-string"
    );
    if (usernameElement) {
        const username = usernameElement.textContent.replace("@", "");
        return username;
    }
    return null;
}

// Utility function to create a donation button element
function createDonationButton(youtubeName, targetElement) {
    return new Promise((resolve, reject) => {
        const donationButton = document.createElement("button");
        donationButton.textContent = "Loading...";
        donationButton.disabled = true;
        donationButton.classList.add(
            "yt-uix-button",
            "yt-uix-button-size-default",
            "yt-uix-button-subscribe-branded"
        ); // Add YouTube's button classes

        // Define an object to store Ethereum address
        let buttonData = { ethereumAddress: null };

        var chromeRuntimePort = chrome.runtime.connect({ name: "content" });
        chromeRuntimePort.onDisconnect.addListener(() => {
            chromeRuntimePort = undefined;
        });

        // Send a "ping" message
        chromeRuntimePort.postMessage({ message: "ping" });
        chromeRuntimePort.onMessage.addListener((response) => {
            // Check for the "pong" message
            if (response.message === "pong") {
                // Now we know the background script is ready to receive messages
                // Send the actual message
                chromeRuntimePort.postMessage({ youtubeName });
                console.log(chromeRuntimePort);
            } else {
                const ethereumAddress = response.ethereumAddress;
                console.log(ethereumAddress);
                // Update your donation button with the returned Ethereum address
                if (ethereumAddress) {
                    donationButton.textContent = "Donate";
                    donationButton.disabled = false;
                    // Store Ethereum address in the buttonData object
                    buttonData.ethereumAddress = ethereumAddress;
                    console.log(buttonData.ethereumAddress);
                }
            }
        });

        // Define the click handler for the donation button.
        donationButton.addEventListener("click", () => {
            if (buttonData.ethereumAddress) {
                alert(`Donate to Ethereum address: ${buttonData.ethereumAddress}`);
            } else {
                alert("Ethereum address not found. Unable to donate.");
            }
        });

        const mutationObserver = new MutationObserver(() => {
            const subscribeButton = document.querySelector("#subscribe-button");
            if (subscribeButton) {
                const buttonContainer = document.createElement("div");
                buttonContainer.style.display = "flex";
                buttonContainer.style.alignItems = "center";
                buttonContainer.appendChild(donationButton);
                subscribeButton.parentNode.appendChild(buttonContainer);
            }
        });

        const channelContainer = document.querySelector("#channel-container");
        if (channelContainer) {
            mutationObserver.observe(channelContainer, { childList: true });
        }

        resolve(donationButton);
    });
}

// Function that injects the donation button into the page if the target string is found in the video description
async function injectDonationButtonIfApplicable(targetString) {
    const descriptionElement = findTargetVideoDescriptionElement(targetString);
    console.log(descriptionElement);

    if (descriptionElement) {
        const channelContainer = document.querySelector(
            "#channel-container.style-scope.ytd-reel-player-header-renderer"
        );
        console.log(channelContainer);

        if (channelContainer) {
            // Look for the subscribe button container within the channel container
            const subscribeButtonContainer = channelContainer.querySelector("#subscribe-button");

            if (subscribeButtonContainer) {
                const existingButton = subscribeButtonContainer.querySelector("button");
                if (!existingButton || !existingButton.textContent.includes("Donate")) {
                    const youtubeName = getYoutubeUsername();
                    console.log(youtubeName);
                    const donationButton = await createDonationButton(
                        youtubeName,
                        channelContainer
                    );
                    console.log(donationButton);
                    console.log("Injecting donation button...");

                    // Append the donation button to the existing subscribe button container
                    subscribeButtonContainer.appendChild(donationButton);

                    // Adjust your CSS for both buttons to display them inline
                    donationButton.style.cssText = "display: inline-block; margin-left: 10px;";
                    if (existingButton) {
                        existingButton.style.display = "inline-block";
                    }

                    return true; // Button was injected
                } else {
                    console.log("Button already injected.");
                }
            } else {
                console.log("Subscribe button container not found.");
            }
        } else {
            console.log("Channel container not found.");
        }
    } else {
        console.log("Description element not found.");
    }

    return false; // Button was not injected
}

// Check for the description element and inject the donation
var intervalId = setInterval(async () => {
    // Check if extension context is valid
    if (!chrome.runtime?.id) {
        // The extension was reloaded and this script is orphaned
        clearInterval(intervalId);
        return;
    }
    const buttonInjected = await injectDonationButtonIfApplicable(targetString);
    if (buttonInjected) {
        clearInterval(intervalId);
    }
}, 1000);
