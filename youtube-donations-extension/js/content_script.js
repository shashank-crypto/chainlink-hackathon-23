console.log("Content script is running...");

// Utility function to find the target video description element containing the target string
function findTargetVideoDescriptionElement(targetString) {
    const descriptionElements = Array.from(
        document.querySelectorAll(
            "yt-formatted-string, span.yt-simple-endpoint.style-scope.yt-formatted-string"
        )
    );
    return descriptionElements.find((element) => element.textContent.includes(targetString));
}

// Utility function to create a donation button element
function createDonationButton(ethereumAddress) {
    const donationButton = document.createElement("button");
    donationButton.textContent = "Donate";
    donationButton.style.cssText =
        "padding: 8px 16px; background-color: #1E88E5; color: #FFF; font-weight: bold; border: none; cursor: pointer;";

    donationButton.addEventListener("click", () => {
        // Your logic to handle the donation, e.g., open a modal with donation options or redirect to a donation page
        alert(`Donate to Ethereum address: ${ethereumAddress}`);
    });

    return donationButton;
}

// Function that injects the donation button into the page if the target string is found in the video description
function injectDonationButtonIfApplicable(targetString, ethereumAddress) {
    const descriptionElement = findTargetVideoDescriptionElement(targetString);

    if (descriptionElement) {
        if (
            !descriptionElement.nextElementSibling ||
            !descriptionElement.nextElementSibling.matches("button")
        ) {
            const donationButton = createDonationButton(ethereumAddress);
            console.log("Injecting donation button...");
            descriptionElement.parentNode.insertBefore(
                donationButton,
                descriptionElement.nextSibling
            );
        } else {
            console.log("Button already injected.");
        }
    } else {
        console.log("Description element not found.");
    }
}

// Replace with the actual Ethereum address
const ethereumAddress = "0x8C48ff0F9af301Ae5F00541Fa00b2D8796C42196";
const targetString = `This video accepts donations through youtube-donate`;
console.log(targetString);

// Check for the description element and inject the donation button every 1 second
setInterval(() => {
    injectDonationButtonIfApplicable(targetString, ethereumAddress);
}, 1000);
